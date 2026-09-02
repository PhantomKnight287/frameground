import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import NotFound from "@/pages/404";
//@ts-expect-error
import Dashboard, { getServerSideProps as dashboardProps } from "@/pages/dashboard";
//@ts-expect-error
import Admin, { getServerSideProps as adminProps } from "@/pages/admin";

const context = (cookies: Record<string, string> = {}) => ({
  query: {},
  req: { cookies, headers: {} },
  res: { setHeader: vi.fn() },
});

describe("Tests for Redirects and Not Found", () => {
  describe("Tests for the 404 page", () => {
    it("Renders the heading", () => {
      //@ts-expect-error
      const { container } = render(<NotFound />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Page not found");
    });

    it("Links back home", () => {
      //@ts-expect-error
      const { container } = render(<NotFound />);
      const link = container.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/");
      expect(link?.textContent).toBe("Go home");
    });
  });

  describe("Tests for the dashboard", () => {
    it("Redirects temporarily when there is no token", async () => {
      const result = await dashboardProps(context());
      expect(result.redirect).toEqual({ destination: "/login", permanent: false });
      expect(result.props).toBeUndefined();
    });

    it("Passes the token through as the user", async () => {
      const result = await dashboardProps(context({ token: "ada" }));
      expect(result.redirect).toBeUndefined();
      expect(result.props.user).toBe("ada");
    });

    it("Greets the user", () => {
      //@ts-expect-error
      const { container } = render(<Dashboard user="ada" />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Welcome, ada");
    });
  });

  describe("Tests for the admin page", () => {
    it("Is not found without the admin role", async () => {
      expect((await adminProps(context())).notFound).toBe(true);
      expect((await adminProps(context({ role: "user" }))).notFound).toBe(true);
    });

    it("Does not redirect, so the page stays invisible", async () => {
      const result = await adminProps(context({ role: "user" }));
      expect(result.redirect).toBeUndefined();
    });

    it("Renders for an admin", async () => {
      const result = await adminProps(context({ role: "admin" }));
      expect(result.notFound).toBeUndefined();
      expect(result.props).toEqual({});

      //@ts-expect-error
      const { container } = render(<Admin />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Admin");
    });
  });
});
