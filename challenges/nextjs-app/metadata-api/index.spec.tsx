import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import RootLayout, { metadata } from "@/app/layout";
//@ts-expect-error
import Post, { generateMetadata } from "@/app/blog/[slug]/page";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("Tests for the Metadata API", () => {
  describe("Tests for the root layout", () => {
    it("Still renders the document shell", () => {
      const html = RootLayout({ children: "PAGE" }) as any;
      expect(html.type).toBe("html");
      expect(html.props.lang).toBe("en");
      expect(html.props.children.type).toBe("body");
    });

    it("Exports a title template", () => {
      expect(metadata.title).toEqual({
        default: "FrameGround",
        template: "%s | FrameGround",
      });
    });

    it("Exports a default description", () => {
      expect(metadata.description).toBe("Learn Next.js by building");
    });
  });

  describe("Tests for generateMetadata", () => {
    it("Describes the post", async () => {
      const result = await generateMetadata(params("routing"));
      expect(result.title).toBe("Routing in Next.js");
      expect(result.description).toBe("Folders, files and everything in between");
    });

    it("Repeats the description in the Open Graph object", async () => {
      const result = await generateMetadata(params("hello-world"));
      expect(result.openGraph).toEqual({
        title: "Hello World",
        description: "The first post on this blog",
      });
    });

    it("Handles a slug with no post", async () => {
      const result = await generateMetadata(params("nope"));
      expect(result.title).toBe("Post not found");
      expect(result.description).toBeUndefined();
      expect(result.openGraph).toBeUndefined();
    });
  });

  describe("Tests for the page", () => {
    it("Renders the post", async () => {
      const { container } = render(await Post(params("hello-world")));
      expect(container.querySelector("h1#title")?.textContent).toBe("Hello World");
      expect(container.querySelector("p#body")?.textContent).toBe("My first post");
    });
  });
});
