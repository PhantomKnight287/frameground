import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Product from "@/app/products/[id]/page";
//@ts-expect-error
import Docs from "@/app/docs/[...slug]/page";
//@ts-expect-error
import Search from "@/app/search/page";

/** Server Components are async, so they are awaited before being rendered. */
const renderAsync = async (element: Promise<any> | any) => render(await element);

describe("Tests for Dynamic Segments", () => {
  describe("Tests for /products/[id]", () => {
    it("Awaits params and renders the id", async () => {
      const { container } = await renderAsync(
        Product({ params: Promise.resolve({ id: "42" }) })
      );
      expect(container.querySelector("h1#title")?.textContent).toBe("Product 42");
    });

    it("Works for any id", async () => {
      const { container } = await renderAsync(
        Product({ params: Promise.resolve({ id: "keyboard" }) })
      );
      expect(container.querySelector("h1#title")?.textContent).toBe("Product keyboard");
    });
  });

  describe("Tests for /docs/[...slug]", () => {
    it("Renders a single segment", async () => {
      const { container } = await renderAsync(
        Docs({ params: Promise.resolve({ slug: ["routing"] }) })
      );
      expect(container.querySelector("h1#title")?.textContent).toBe("routing");
      expect(container.querySelector("p#depth")?.textContent).toBe("1");
    });

    it("Joins nested segments", async () => {
      const { container } = await renderAsync(
        Docs({ params: Promise.resolve({ slug: ["api", "create-user"] }) })
      );
      expect(container.querySelector("h1#title")?.textContent).toBe("api / create-user");
      expect(container.querySelector("p#depth")?.textContent).toBe("2");
    });
  });

  describe("Tests for /search", () => {
    it("Reads the q search param", async () => {
      const { container } = await renderAsync(
        Search({ searchParams: Promise.resolve({ q: "next" }) })
      );
      expect(container.querySelector("p#query")?.textContent).toBe('Searching for "next"');
    });

    it("Falls back to an empty query", async () => {
      const { container } = await renderAsync(Search({ searchParams: Promise.resolve({}) }));
      expect(container.querySelector("p#query")?.textContent).toBe('Searching for ""');
    });

    it("Takes the first value when the param repeats", async () => {
      const { container } = await renderAsync(
        Search({ searchParams: Promise.resolve({ q: ["first", "second"] }) })
      );
      expect(container.querySelector("p#query")?.textContent).toBe('Searching for "first"');
    });
  });
});
