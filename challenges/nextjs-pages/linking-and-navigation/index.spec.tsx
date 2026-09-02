import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const push = vi.fn();
let pathname = "/";

vi.mock("next/router", () => ({
  useRouter: () => ({ pathname, asPath: pathname, query: {}, push, replace: vi.fn() }),
}));

//@ts-expect-error
import Nav from "@/components/nav";
//@ts-expect-error
import LoginButton from "@/components/login-button";

describe("Tests for Linking and Navigation", () => {
  beforeEach(() => {
    push.mockClear();
    pathname = "/";
  });

  describe("Tests for Nav", () => {
    it("Renders the three links in order", () => {
      //@ts-expect-error
      const { container } = render(<Nav />);
      const links = container.querySelectorAll("nav#nav a");
      expect(links).toHaveLength(3);
      expect([...links].map((a) => a.textContent)).toEqual(["Home", "Blog", "About"]);
      expect([...links].map((a) => a.getAttribute("href"))).toEqual(["/", "/blog", "/about"]);
    });

    it("Marks the current route with aria-current", () => {
      //@ts-expect-error
      const { container } = render(<Nav />);
      const links = container.querySelectorAll("nav#nav a");
      expect(links[0].getAttribute("aria-current")).toBe("page");
      expect(links[1].hasAttribute("aria-current")).toBe(false);
      expect(links[2].hasAttribute("aria-current")).toBe(false);
    });

    it("Moves aria-current when the route changes", () => {
      pathname = "/blog";
      //@ts-expect-error
      const { container } = render(<Nav />);
      const links = container.querySelectorAll("nav#nav a");
      expect(links[0].hasAttribute("aria-current")).toBe(false);
      expect(links[1].getAttribute("aria-current")).toBe("page");
    });
  });

  describe("Tests for LoginButton", () => {
    it("Renders a button", () => {
      //@ts-expect-error
      const { container } = render(<LoginButton />);
      expect(container.querySelector("button#login")?.textContent).toBe("Log in");
    });

    it("Navigates to /dashboard on click", () => {
      //@ts-expect-error
      const { container } = render(<LoginButton />);
      fireEvent.click(container.querySelector("button#login")!);
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });
});
