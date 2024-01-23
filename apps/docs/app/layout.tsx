import { DocsLayout } from "next-docs-ui/layout";
import "./global.css";
import { RootProvider } from "next-docs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { pageTree } from "./source";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <RootProvider>
          <DocsLayout
            tree={pageTree}
            nav={{
              title: "FrameGround",
              githubUrl: "https://github.com/phantomknight287/frameground",
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
