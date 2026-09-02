import { describe, it, expect } from "vitest";
import { Suspense, isValidElement } from "react";
import { render } from "@testing-library/react";
//@ts-expect-error
import Loading from "@/app/dashboard/loading";
//@ts-expect-error
import Dashboard from "@/app/dashboard/page";
//@ts-expect-error
import Stats from "@/components/stats";

/** Collects every element in a rendered tree, so the Suspense boundary can be found. */
function flatten(node: any): any[] {
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (!isValidElement(node)) return [];
  return [node, ...flatten((node.props as any).children)];
}

describe("Tests for Loading and Streaming", () => {
  describe("Tests for loading.jsx", () => {
    it("Renders the loading UI", () => {
      //@ts-expect-error
      const { container } = render(<Loading />);
      expect(container.querySelector("p#loading")?.textContent).toBe("Loading dashboard...");
    });
  });

  describe("Tests for Stats", () => {
    it("Is an async component", () => {
      const result = Stats();
      expect(typeof result.then).toBe("function");
    });

    it("Renders the numbers it awaited", async () => {
      const { container } = render(await Stats());
      expect(container.querySelector("p#revenue")?.textContent).toBe("4200");
      expect(container.querySelector("p#signups")?.textContent).toBe("87");
    });
  });

  describe("Tests for the dashboard page", () => {
    it("Renders without awaiting anything", () => {
      const result = Dashboard();
      expect(typeof result?.then).not.toBe("function");
    });

    it("Renders the heading outside the boundary", () => {
      const elements = flatten(Dashboard());
      const heading = elements.find((element) => element.props?.id === "title");

      expect(heading).toBeTruthy();
      expect(heading.type).toBe("h1");
      expect(heading.props.children).toBe("Dashboard");
    });

    it("Wraps Stats in a Suspense boundary", () => {
      const boundary = flatten(Dashboard()).find((element) => element.type === Suspense);

      expect(boundary).toBeTruthy();
      const children = boundary.props.children;
      expect(children.type).toBe(Stats);
    });

    it("Uses the stats fallback while it streams", () => {
      const boundary = flatten(Dashboard()).find((element) => element.type === Suspense);
      const { container } = render(boundary.props.fallback);

      expect(container.querySelector("p#stats-loading")?.textContent).toBe("Loading stats...");
    });
  });
});
