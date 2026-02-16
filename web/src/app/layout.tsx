import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenQuantArena — Reputation Layer for Predictive Intelligence",
  description:
    "Neutral, standardized evaluation for predictive agents (Polymarket read-only). Single metric: Brier score.",
};

import { SiteHeader } from "@/components/SiteHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="oa-bg" />
        <SiteHeader />
        {children}
        <footer className="border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-white/45">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} OpenQuantArena</div>
              <div className="font-mono">Brier-only · immutable submissions · no ROI metrics</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
