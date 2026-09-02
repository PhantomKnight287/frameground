import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Search, { getServerSideProps } from "@/pages/search";

const context = (query: Record<string, unknown> = {}) => {
  const res = { setHeader: vi.fn() };
  return { context: { query, req: { cookies: {}, headers: {} }, res }, res };
};

describe("Tests for Server Side Rendering", () => {
  describe("Tests for getServerSideProps", () => {
    it("Is exported from the page", () => {
      expect(typeof getServerSideProps).toBe("function");
    });

    it("Returns every post when there is no query", async () => {
      const { context: ctx } = context();
      const result = await getServerSideProps(ctx);
      expect(result.props.q).toBe("");
      expect(result.props.results).toHaveLength(3);
    });

    it("Filters by the q search param", async () => {
      const { context: ctx } = context({ q: "routing" });
      const result = await getServerSideProps(ctx);
      expect(result.props.q).toBe("routing");
      expect(result.props.results.map((post: any) => post.slug)).toEqual(["routing"]);
    });

    it("Compares case-insensitively", async () => {
      const { context: ctx } = context({ q: "HELLO" });
      const result = await getServerSideProps(ctx);
      expect(result.props.results.map((post: any) => post.slug)).toEqual(["hello-world"]);
    });

    it("Returns no results when nothing matches", async () => {
      const { context: ctx } = context({ q: "zzz" });
      const result = await getServerSideProps(ctx);
      expect(result.props.results).toEqual([]);
    });

    it("Marks the response as uncacheable", async () => {
      const { context: ctx, res } = context({ q: "a" });
      await getServerSideProps(ctx);
      expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    });
  });

  describe("Tests for the page", () => {
    const results = [
      { slug: "a", title: "First" },
      { slug: "b", title: "Second" },
    ];

    it("Renders the heading and the summary", () => {
      //@ts-expect-error
      const { container } = render(<Search q="fir" results={results} />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Search");
      expect(container.querySelector("p#summary")?.textContent).toBe('2 results for "fir"');
    });

    it("Renders one item per result", () => {
      //@ts-expect-error
      const { container } = render(<Search q="" results={results} />);
      const items = container.querySelectorAll("ul#results li");
      expect([...items].map((li) => li.textContent)).toEqual(["First", "Second"]);
    });

    it("Renders an empty state instead of the list", () => {
      //@ts-expect-error
      const { container } = render(<Search q="zzz" results={[]} />);
      expect(container.querySelector("p#empty")?.textContent).toBe("No matches");
      expect(container.querySelector("ul#results")).toBeNull();
      expect(container.querySelector("p#summary")?.textContent).toBe('0 results for "zzz"');
    });
  });
});
