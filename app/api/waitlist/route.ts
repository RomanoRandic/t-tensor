import { NextResponse } from "next/server";
import { saveWaitlistEntry } from "@/lib/store";
import { parseWaitlist, type WaitlistEntry } from "@/lib/waitlist";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 10;
const hits = new Map<string, { count: number; reset: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_HITS;
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function json(body: { ok: boolean; saved?: boolean; error?: string }, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ ok: false, error: "Invalid request." }, 403);
  }
  if (rateLimited(clientKey(request))) {
    return json({ ok: false, error: "Too many signups from this network. Try again in a few minutes." }, 429);
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  if (text.length > 4000) {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const parsed = parseWaitlist(body);
  if (!parsed.ok) {
    return json({ ok: false, error: parsed.error }, 400);
  }
  if (parsed.honeypot) {
    return json({ ok: true, saved: true });
  }

  const entry: WaitlistEntry = {
    ...parsed.entry,
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await saveWaitlistEntry(entry);
    return json({ ok: true, saved: result.persisted });
  } catch {
    return json({ ok: false, error: "Could not save your signup. Please try again." }, 500);
  }
}
