import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import NextAuthProvider from "@/providers/next-auth";
import { siteConfig } from "@repo/config";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <TooltipProvider>
              <Header />
              {children}
            </TooltipProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
