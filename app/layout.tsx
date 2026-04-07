import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const devanagariFont = localFont({
  src: "../public/fonts/NotoSansDevanagari-Variable.ttf",
  variable: "--font-devanagari",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Administrative Letter Generator",
  description:
    "Create government-style administrative letters in English with instant Hindi and Marathi translations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${devanagariFont.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
