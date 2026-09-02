import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
//@ts-expect-error
import { middleware, config } from "@/middleware";

const request = (path: string, cookie?: string) =>
  new NextRequest(`https://frameground.test${path}`, {
    headers: cookie ? { cookie } : {},
  });

describe("Tests for Middleware", () => {
  describe("The dashboard gate", () => {
    it("Redirects to /login without a token", () => {
      const response = middleware(request("/dashboard"));
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    });

    it("Guards nested paths too", () => {
      const response = middleware(request("/dashboard/settings/profile"));
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    });

    it("Lets a request with a token through", () => {
      const response = middleware(request("/dashboard", "token=abc"));
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    });
  });

  describe("The /about-us rewrite", () => {
    it("Rewrites to /about", () => {
      const response = middleware(request("/about-us"));
      const rewrite = response.headers.get("x-middleware-rewrite");

      expect(rewrite).toBeTruthy();
      expect(new URL(rewrite!).pathname).toBe("/about");
    });

    it("Does not redirect, so the URL stays put", () => {
      const response = middleware(request("/about-us"));
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });
  });

  describe("Everything else", () => {
    it("Continues to the page", () => {
      const response = middleware(request("/blog/hello-world"));
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });

    it("Sets the x-frameground header on responses that continue", () => {
      expect(middleware(request("/blog")).headers.get("x-frameground")).toBe("1");
      expect(middleware(request("/dashboard", "token=abc")).headers.get("x-frameground")).toBe("1");
    });
  });

  describe("The matcher", () => {
    it("Only runs on the paths that need it", () => {
      expect(config.matcher).toEqual(["/dashboard/:path*", "/about-us"]);
    });
  });
});
