import { NextResponse } from "next/server";
import { APK_URL } from "@/lib/apk";
import { bumpApkDownloads } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    await bumpApkDownloads();
  } catch (error) {
    console.error(error);
  }
  return NextResponse.redirect(APK_URL, 302);
}
