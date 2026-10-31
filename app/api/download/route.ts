import { NextResponse } from "next/server";
import { APK_URL, parseDownloadSource } from "@/lib/apk";
import { recordApkDownload } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const source = parseDownloadSource(new URL(request.url).searchParams.get("from"));
  try {
    await recordApkDownload(source);
  } catch (error) {
    console.error(error);
  }
  return NextResponse.redirect(APK_URL, 302);
}
