export const CONDITIONS = [
  "Hypothyroidism",
  "Hashimoto's",
  "Thyroid removed (thyroidectomy)",
  "Caring for someone with thyroid disease",
  "Other",
] as const;

export const PAY_ANSWERS = ["yes", "maybe", "no"] as const;

export type Condition = (typeof CONDITIONS)[number];
export type PayAnswer = (typeof PAY_ANSWERS)[number];

export type WaitlistEntry = {
  email: string;
  condition: Condition;
  location: string;
  wouldPay: PayAnswer;
  createdAt: string;
};

export type ParseResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; entry: Omit<WaitlistEntry, "createdAt"> }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanLine(value: string, max: number): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function isCondition(value: string): value is Condition {
  return (CONDITIONS as readonly string[]).includes(value);
}

function isPayAnswer(value: string): value is PayAnswer {
  return (PAY_ANSWERS as readonly string[]).includes(value);
}

export function parseWaitlist(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request." };
  }

  const record = body as Record<string, unknown>;
  if (cleanLine(readString(record.hp_field), 200).length > 0) {
    return { ok: true, honeypot: true };
  }

  const email = cleanLine(readString(record.email), 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }

  const condition = cleanLine(readString(record.condition), 80);
  if (!isCondition(condition)) {
    return { ok: false, error: "Choose the option that describes you." };
  }

  const location = cleanLine(readString(record.location), 80);
  if (location.length < 2) {
    return { ok: false, error: "Add where you live." };
  }

  const wouldPay = cleanLine(readString(record.wouldPay), 10);
  if (!isPayAnswer(wouldPay)) {
    return { ok: false, error: "Let us know if you'd pay $9.99/month." };
  }

  return {
    ok: true,
    honeypot: false,
    entry: { email, condition, location, wouldPay },
  };
}
