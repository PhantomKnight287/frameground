import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Blog from "@/pages/blog/index";
//@ts-expect-error
import HelloWorld from "@/pages/blog/hello-world";
//@ts-expect-error
import GettingStarted from "@/pages/docs/getting-started";

describe("Tests for Nested Routes", () => {
  describe("/blog", () => {
    it("Lives in pages/blog/index.jsx", () => {
      expect(typeof Blog).toBe("function");
    });

    it("Renders the title", () => {
      //@ts-expect-error
      const { container } = render(<Blog />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Blog");
    });

    it("Renders the PostList component", () => {
      //@ts-expect-error
      const { container } = render(<Blog />);
      const posts = container.querySelector("ul#posts");
      expect(posts).toBeTruthy();
      expect(posts?.querySelectorAll("li")).toHaveLength(2);
    });
  });

  describe("/blog/hello-world", () => {
    it("Renders the post", () => {
      //@ts-expect-error
      const { container } = render(<HelloWorld />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Hello World");
      expect(container.querySelector("p#body")?.textContent).toBe("My first post");
    });
  });

  describe("/docs/getting-started", () => {
    it("Renders the title", () => {
      //@ts-expect-error
      const { container } = render(<GettingStarted />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Getting Started");
    });
  });
});
