import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import BlogLayout from "@/app/blog/layout";
//@ts-expect-error
import Blog from "@/app/blog/page";
//@ts-expect-error
import Archive from "@/app/blog/archive/page";
//@ts-expect-error
import Pricing from "@/app/(marketing)/pricing/page";

describe("Tests for Nested Layouts", () => {
  describe("Tests for the blog layout", () => {
    it("Wraps its children", () => {
      const { container } = render(
        //@ts-expect-error
        <BlogLayout>
          <p id="child">child</p>
        </BlogLayout>
      );
      expect(container.querySelector("section#blog-layout p#child")).toBeTruthy();
    });

    it("Renders the section nav", () => {
      //@ts-expect-error
      const { container } = render(<BlogLayout>{null}</BlogLayout>);
      const links = container.querySelectorAll("nav#blog-nav a");

      expect([...links].map((a) => a.textContent)).toEqual(["Blog", "Archive"]);
      expect([...links].map((a) => a.getAttribute("href"))).toEqual([
        "/blog",
        "/blog/archive",
      ]);
    });

    it("Renders the nav before the children", () => {
      const { container } = render(
        //@ts-expect-error
        <BlogLayout>
          <p id="child">child</p>
        </BlogLayout>
      );
      const section = container.querySelector("section#blog-layout")!;
      const nav = section.querySelector("nav#blog-nav")!;
      const child = section.querySelector("p#child")!;

      expect(nav.compareDocumentPosition(child) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe("Tests for the pages", () => {
    it("Renders /blog", () => {
      //@ts-expect-error
      const { container } = render(<Blog />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Blog");
    });

    it("Renders /blog/archive", () => {
      //@ts-expect-error
      const { container } = render(<Archive />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Archive");
    });

    it("Renders /pricing from inside the route group", () => {
      //@ts-expect-error
      const { container } = render(<Pricing />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Pricing");
    });
  });
});
