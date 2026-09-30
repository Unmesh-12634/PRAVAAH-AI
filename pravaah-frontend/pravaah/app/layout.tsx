import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
  preload: false,
});

import GoogleTranslateScript from "@/components/GoogleTranslateScript";

export const metadata: Metadata = {
  title: "PRAVAAH AI — National Disaster Intelligence & Anticipatory Action Platform",
  description: "C4ISR v4.2 Tactical Emergency Operations Platform • Andhra Pradesh SDMA & NDMA Command Center",
  icons: {
    icon: "/pravaah-logo.png",
    shortcut: "/pravaah-logo.png",
    apple: "/pravaah-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/pravaah-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/pravaah-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F6F8FB] text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 notranslate-disabled"
        suppressHydrationWarning
      >
        <GoogleTranslateScript />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
