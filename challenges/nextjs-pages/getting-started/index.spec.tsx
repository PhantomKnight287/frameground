import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error - the challenge is authored in JSX
import Home from "@/pages/index";
//@ts-expect-error
import About from "@/pages/about";

describe("Tests for Your First Next.js App", () => {
  describe("The home page", () => {
    it("Is the default export of pages/index.jsx", () => {
      expect(typeof Home).toBe("function");
    });

    it("Renders the title", () => {
      //@ts-expect-error
      const { container } = render(<Home />);
      expect(container.querySelector("h1#title")?.textContent).toBe("FrameGround");
    });

    it("Renders the tagline", () => {
      //@ts-expect-error
      const { container } = render(<Home />);
      expect(container.querySelector("p#tagline")?.textContent).toBe(
        "Learn Next.js by building"
      );
    });
  });

  describe("The about page", () => {
    it("Is the default export of pages/about.jsx", () => {
      expect(typeof About).toBe("function");
    });

    it("Renders the title", () => {
      //@ts-expect-error
      const { container } = render(<About />);
      expect(container.querySelector("h1#title")?.textContent).toBe("About");
    });
  });
});
