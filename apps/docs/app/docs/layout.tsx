import { pageTree } from '../source';
import { DocsLayout } from 'next-docs-ui/layout';
import type { ReactNode } from 'react';

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={pageTree} nav={{ title: 'FrameGround',githubUrl:"https://github.com/phantomknight287/frameground" }}>
      {children}
    </DocsLayout>
  );
}
