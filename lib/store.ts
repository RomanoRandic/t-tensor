import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { WaitlistEntry } from "@/lib/waitlist";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.ndjson");

function readWebhook(): string | null {
  const raw = process.env.WAITLIST_WEBHOOK_URL?.trim();
  if (!raw) return null;

  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Webhook URL must be http(s).");
  }
  return url.toString();
}

async function postWebhook(url: string, entry: WaitlistEntry): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error("Webhook failed.");
  }
}

async function sendResend(entry: WaitlistEntry): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return;

  const to = process.env.WAITLIST_TO_EMAIL?.trim() || "randic.petra@gmail.com";
  const from = process.env.WAITLIST_FROM_EMAIL?.trim() || "T-Tensor <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `T-Tensor waitlist: ${entry.email}`,
      text: [
        "New T-Tensor waitlist signup",
        "",
        `Email: ${entry.email}`,
        `Condition: ${entry.condition}`,
        `Location: ${entry.location}`,
        `Would pay $9.99/month: ${entry.wouldPay}`,
        `Time: ${entry.createdAt}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error("Email provider failed.");
  }
}

async function writeLocal(entry: WaitlistEntry): Promise<boolean> {
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await appendFile(DATA_FILE, `${JSON.stringify(entry)}\n`, "utf8");
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EPERM" || code === "EACCES") {
      return false;
    }
    throw error;
  }
}

export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<{ persisted: boolean }> {
  let persisted = false;

  const webhook = readWebhook();
  if (webhook) {
    await postWebhook(webhook, entry);
    persisted = true;
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    await sendResend(entry);
    persisted = true;
  }

  const wrote = await writeLocal(entry);
  return { persisted: persisted || wrote };
}
