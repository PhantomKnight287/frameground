import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import RootLayout from "@/app/layout";
//@ts-expect-error
import Home from "@/app/page";
//@ts-expect-error
import About from "@/app/about/page";

describe("Tests for App Router Basics", () => {
  describe("Tests for the root layout", () => {
    // The layout renders <html> and <body>, which cannot be mounted inside a
    // test container, so the element tree it returns is inspected directly.
    const tree = () => RootLayout({ children: "PAGE" }) as any;

    it("Returns an html element with a lang", () => {
      const html = tree();
      expect(html.type).toBe("html");
      expect(html.props.lang).toBe("en");
    });

    it("Renders a body", () => {
      const body = tree().props.children;
      expect(body.type).toBe("body");
    });

    it("Renders the header and the page inside main", () => {
      const { container } = render(tree().props.children.props.children);
      expect(container.querySelector("header#header h1")?.textContent).toBe("FrameGround");
      expect(container.querySelector("main#content")?.textContent).toBe("PAGE");
    });
  });

  describe("Tests for the home page", () => {
    it("Renders at app/page.jsx", () => {
      //@ts-expect-error
      const { container } = render(<Home />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Home");
      expect(container.querySelector("p#tagline")?.textContent).toBe(
        "Learn Next.js by building"
      );
    });
  });

  describe("Tests for the about page", () => {
    it("Renders at app/about/page.jsx", () => {
      //@ts-expect-error
      const { container } = render(<About />);
      expect(container.querySelector("h1#title")?.textContent).toBe("About");
    });
  });
});
