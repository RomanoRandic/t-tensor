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
    { media: "(prefers-color-scheme: light)", color: "#f6f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#120d1c" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
