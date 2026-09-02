import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

let query: Record<string, unknown> = {};

vi.mock("next/router", () => ({
  useRouter: () => ({
    query,
    isReady: Object.keys(query).length > 0,
    pathname: "/",
    push: vi.fn(),
  }),
}));

//@ts-expect-error
import Product from "@/pages/products/[id]";
//@ts-expect-error
import Docs from "@/pages/docs/[...slug]";

describe("Tests for Dynamic Routes", () => {
  describe("Tests for /products/[id]", () => {
    it("Renders a loading state before the query is ready", () => {
      query = {};
      //@ts-expect-error
      const { container } = render(<Product />);
      expect(container.querySelector("p#loading")?.textContent).toBe("Loading...");
      expect(container.querySelector("h1#title")).toBeNull();
    });

    it("Renders the id from the route", () => {
      query = { id: "42" };
      //@ts-expect-error
      const { container } = render(<Product />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Product 42");
    });

    it("Works for any id", () => {
      query = { id: "keyboard" };
      //@ts-expect-error
      const { container } = render(<Product />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Product keyboard");
    });
  });

  describe("Tests for /docs/[...slug]", () => {
    it("Renders a loading state before the query is ready", () => {
      query = {};
      //@ts-expect-error
      const { container } = render(<Docs />);
      expect(container.querySelector("p#loading")?.textContent).toBe("Loading...");
    });

    it("Joins a single segment", () => {
      query = { slug: ["routing"] };
      //@ts-expect-error
      const { container } = render(<Docs />);
      expect(container.querySelector("h1#title")?.textContent).toBe("routing");
      expect(container.querySelector("p#depth")?.textContent).toBe("1");
    });

    it("Joins nested segments", () => {
      query = { slug: ["api", "create-user"] };
      //@ts-expect-error
      const { container } = render(<Docs />);
      expect(container.querySelector("h1#title")?.textContent).toBe("api / create-user");
      expect(container.querySelector("p#depth")?.textContent).toBe("2");
    });
  });
});
