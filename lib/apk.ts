export const APK_URL = "https://github.com/RomanoRandic/t-tensor/releases/download/v1.0.0/Thyra.apk";

export const DOWNLOAD_SOURCES = ["hero", "android"] as const;

export type DownloadSource = (typeof DOWNLOAD_SOURCES)[number];

export function parseDownloadSource(value: string | null): DownloadSource {
  return value === "android" ? "android" : "hero";
}
