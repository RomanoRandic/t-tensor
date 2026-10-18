import type { WaitlistEntry } from "@/lib/waitlist";

function readConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set.");
  }
  return { url: url.replace(/\/+$/, ""), key };
}

export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  const { url, key } = readConfig();

  // The secret key bypasses row level security, so it must never reach the browser.
  const response = await fetch(`${url}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      email: entry.email,
      condition: entry.condition,
      location: entry.location,
      would_pay: entry.wouldPay,
      created_at: entry.createdAt,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${detail}`);
  }
}
