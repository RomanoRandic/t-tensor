import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Hanken_Grotesk, Young_Serif } from "next/font/google";
import "./globals.css";

const display = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const description =
  "Thyra tracks your thyroid medication, symptoms and lab results between blood tests and turns them into one page for your doctor. On Android now; iPhone waitlist open.";

export const metadata: Metadata = {
  title: "Thyra for Android and iPhone",
  description,
  applicationName: "Thyra",
  openGraph: {
    title: "Thyra — Know why you feel off between blood tests",
    description,
    type: "website",
    locale: "en_US",
    siteName: "Thyra",
  },
  twitter: {
    card: "summary",
    title: "Thyra — Know why you feel off between blood tests",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3b2f" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3b2f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
