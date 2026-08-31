import type { MDXComponents } from "mdx/types";
import defaultComponents from "fumadocs-ui/mdx";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Callout } from "fumadocs-ui/components/callout";
import Link from "next/link";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    TypeTable,
    ImageZoom,
    Callout,
    Link,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
