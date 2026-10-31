"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

export function DownloadApk({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href="/api/download"
      onClick={() => {
        track("apk_download");
      }}
    >
      {children}
    </a>
  );
}
