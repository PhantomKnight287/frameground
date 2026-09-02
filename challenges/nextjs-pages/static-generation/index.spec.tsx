import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Blog, { getStaticProps } from "@/pages/blog/index";

describe("Tests for Static Generation", () => {
  describe("Tests for getStaticProps", () => {
    it("Is exported from the page", () => {
      expect(typeof getStaticProps).toBe("function");
    });

    it("Returns the posts as props", async () => {
      const result = await getStaticProps({});
      expect(result.props).toBeTruthy();
      expect(result.props.posts).toHaveLength(3);
    });

    it("Sorts the posts newest first", async () => {
      const result = await getStaticProps({});
      expect(result.props.posts.map((post: any) => post.slug)).toEqual([
        "static-generation",
        "routing",
        "hello-world",
      ]);
    });

    it("Returns serialisable props", async () => {
      const result = await getStaticProps({});
      expect(() => JSON.stringify(result.props)).not.toThrow();
      for (const post of result.props.posts) {
        expect(typeof post.date).toBe("string");
      }
    });
  });

  describe("Tests for the page", () => {
    const posts = [
      { slug: "b", title: "Second", date: "2024-02-01T00:00:00.000Z" },
      { slug: "a", title: "First", date: "2024-01-01T00:00:00.000Z" },
    ];

    it("Renders the heading and the count", () => {
      //@ts-expect-error
      const { container } = render(<Blog posts={posts} />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Blog");
      expect(container.querySelector("p#count")?.textContent).toBe("2");
    });

    it("Renders one list item per post, in order", () => {
      //@ts-expect-error
      const { container } = render(<Blog posts={posts} />);
      const items = container.querySelectorAll("ul#posts li");
      expect(items).toHaveLength(2);
      expect([...items].map((li) => li.textContent)).toEqual(["Second", "First"]);
    });

    it("Renders nothing in the list when there are no posts", () => {
      //@ts-expect-error
      const { container } = render(<Blog posts={[]} />);
      expect(container.querySelectorAll("ul#posts li")).toHaveLength(0);
      expect(container.querySelector("p#count")?.textContent).toBe("0");
    });
  });
});
