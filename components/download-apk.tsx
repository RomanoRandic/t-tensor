"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import type { DownloadSource } from "@/lib/apk";

export function DownloadApk({
  from,
  className,
  children,
}: {
  from: DownloadSource;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={`/api/download?from=${from}`}
      onClick={() => {
        track("apk_download", { from });
      }}
    >
      {children}
    </a>
  );
}
