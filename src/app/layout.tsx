import type { Metadata } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GlassNav } from "../components/site/GlassNav";
import { SiteFooter } from "../components/site/SiteFooter";

// Display: Archivo with its width axis, set expanded in .font-display.
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-display",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Amaze Continuity Projects · Software Built for Continuity",
  description:
    "Students building AmazeCC, the app VIT students run their semester on. Open source, privacy-first, made to be handed down.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-ink font-sans text-mist antialiased">
        <a
          href="#main"
          className="sr-only z-[70] rounded-lg bg-mist px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <GlassNav />
        <main id="main" className="w-full flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
