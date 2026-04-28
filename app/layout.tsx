import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const orbitron = localFont({
  src: [
    { path: "../public/brand/heliix/fonts/Orbitron-400.ttf", weight: "400", style: "normal" },
    { path: "../public/brand/heliix/fonts/Orbitron-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const rajdhani = localFont({
  src: [
    { path: "../public/brand/heliix/fonts/Rajdhani-400.ttf", weight: "400", style: "normal" },
    { path: "../public/brand/heliix/fonts/Rajdhani-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
});

const exo2 = localFont({
  src: [
    { path: "../public/brand/heliix/fonts/Exo2-400.ttf", weight: "400", style: "normal" },
    { path: "../public/brand/heliix/fonts/Exo2-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HELiiX",
  description: "Studio for ambitious software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${exo2.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)] font-body">
        {children}
      </body>
    </html>
  );
}
