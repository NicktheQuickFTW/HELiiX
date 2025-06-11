import '@once-ui-system/core/css/tokens.css';
import '@once-ui-system/core/css/styles.css';
import type { Metadata } from "next";
import classNames from "classnames";
import { Inter } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';
import { font, style, meta, baseURL } from "@/resources/once-ui.config";
import { Meta } from "@/components/modules";
import { Providers } from "./providers";
import { ThemeInitializer } from "@/components/client/ThemeInitializer";
import "./globals.css";

const primary = Inter({
    variable: '--font-primary',
    subsets: ['latin'],
    display: 'swap'
});

const tertiary = Space_Grotesk({
    variable: '--font-tertiary',
    subsets: ['latin'],
    display: 'swap'
});

export const metadata: Metadata = Meta.generate({
  title: meta.home.title,
  description: meta.home.description,
  baseURL,
  path: meta.home.path,
  image: meta.home.image,
  keywords: ["Big 12", "Conference", "Athletics", "Operations", "HELiiX", "Sports Management"],
  alternates: {
    canonical: meta.home.canonical,
  },
  robots: {
    index: true,
    follow: true,
  },
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      data-neutral="gray"
      data-brand="green"
      data-accent="aqua"
      data-solid="contrast"
      data-solid-style="plastic"
      data-border="rounded"
      data-surface="translucent"
      data-transition="macro"
      data-scaling="100"
      className={classNames(
        primary.variable,
        tertiary.variable,
      )}
    >
      <head />
      <body suppressHydrationWarning>
        <ThemeInitializer style={style} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}