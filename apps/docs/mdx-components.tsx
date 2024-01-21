import type { MDXComponents } from "mdx/types";
import defaultComponents from "next-docs-ui/mdx/default";
import { TypeTable } from "next-docs-ui/components/type-table";
import { ImageZoom } from "next-docs-ui/components/image-zoom";
import { Callout } from "next-docs-ui/components/callout";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
    TypeTable,
    ImageZoom,
    Callout,
    Link,
  };
}
