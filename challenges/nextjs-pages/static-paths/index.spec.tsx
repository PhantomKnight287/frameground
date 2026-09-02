import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Post, { getStaticPaths, getStaticProps } from "@/pages/blog/[slug]";

describe("Tests for Static Paths", () => {
  describe("Tests for getStaticPaths", () => {
    it("Returns one path per post", async () => {
      const result = await getStaticPaths();
      expect(result.paths).toHaveLength(3);
    });

    it("Shapes each path as { params: { slug } }", async () => {
      const result = await getStaticPaths();
      const slugs = result.paths.map((path: any) => path.params.slug).sort();
      expect(slugs).toEqual(["hello-world", "routing", "static-generation"]);
      for (const path of result.paths) {
        expect(typeof path.params.slug).toBe("string");
      }
    });

    it("Generates missing pages on demand", async () => {
      const result = await getStaticPaths();
      expect(result.fallback).toBe("blocking");
    });
  });

  describe("Tests for getStaticProps", () => {
    it("Returns the matching post", async () => {
      const result = await getStaticProps({ params: { slug: "routing" } });
      expect(result.props.post.title).toBe("Routing in Next.js");
    });

    it("Returns notFound for an unknown slug", async () => {
      const result = await getStaticProps({ params: { slug: "nope" } });
      expect(result.notFound).toBe(true);
      expect(result.props).toBeUndefined();
    });
  });

  describe("Tests for the page", () => {
    const post = {
      slug: "hello-world",
      title: "Hello World",
      date: "2024-01-05T00:00:00.000Z",
    };

    it("Renders the title", () => {
      //@ts-expect-error
      const { container } = render(<Post post={post} />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Hello World");
    });

    it("Renders the date in a machine readable time element", () => {
      //@ts-expect-error
      const { container } = render(<Post post={post} />);
      expect(container.querySelector("time#date")?.getAttribute("datetime")).toBe(post.date);
    });
  });
});
