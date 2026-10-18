import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const sans = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const description =
  "T-Tensor is an AI thyroid tracker that connects your medication, symptoms, labs and wearable data, finds your personal patterns, and writes a doctor-ready summary before every appointment.";

export const metadata: Metadata = {
  title: "T-Tensor Waitlist",
  description,
  applicationName: "T-Tensor",
  openGraph: {
    title: "T-Tensor — Know why you feel off between blood tests",
    description,
    type: "website",
    locale: "en_US",
    siteName: "T-Tensor",
  },
  twitter: {
    card: "summary",
    title: "T-Tensor — Know why you feel off between blood tests",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1619" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#join">
          Skip to waitlist
        </a>
        {children}
      </body>
    </html>
  );
}
