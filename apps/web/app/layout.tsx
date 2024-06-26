import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import NextAuthProvider from "@/providers/next-auth";
import { siteConfig } from "@repo/config";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fontSans } from "@/fonts";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  metadataBase: new URL(env.HOST),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name.replace(" ", ""),
  },
  description: siteConfig.description,
  openGraph: {
    images: [
      {
        url: `${env.HOST}/og.png`,
        width: 451,
        height: 219,
        alt: "Frameground",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: { color: "#ffffff" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <NextAuthProvider>
            <TooltipProvider>
              <Header />
              {children}
              <Analytics />
              <Toaster />
            </TooltipProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
