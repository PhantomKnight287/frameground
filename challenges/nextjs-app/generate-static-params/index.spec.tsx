import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Post, {
  generateStaticParams,
  dynamicParams,
  revalidate,
  //@ts-expect-error
} from "@/app/blog/[slug]/page";

describe("Tests for Static Params", () => {
  describe("Tests for generateStaticParams", () => {
    it("Returns one entry per post", async () => {
      const params = await generateStaticParams();
      expect(params).toHaveLength(3);
    });

    it("Returns flat { slug } objects", async () => {
      const params = await generateStaticParams();

      expect(params.map((entry: any) => entry.slug).sort()).toEqual([
        "hello-world",
        "routing",
        "streaming",
      ]);
      for (const entry of params) {
        expect(Object.keys(entry)).toEqual(["slug"]);
        expect(typeof entry.slug).toBe("string");
      }
    });
  });

  describe("Route segment config", () => {
    it("404s on a slug that was not built", () => {
      expect(dynamicParams).toBe(false);
    });

    it("Regenerates hourly", () => {
      expect(revalidate).toBe(3600);
    });
  });

  describe("Tests for the page", () => {
    it("Renders the post", async () => {
      const { container } = render(
        await Post({ params: Promise.resolve({ slug: "streaming" }) })
      );

      expect(container.querySelector("h1#title")?.textContent).toBe(
        "Streaming with Suspense"
      );
      expect(container.querySelector("time#date")?.getAttribute("datetime")).toBe(
        "2024-03-22T00:00:00.000Z"
      );
    });
  });
});
