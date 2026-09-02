import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { render, fireEvent } from "@testing-library/react";
//@ts-expect-error
import ErrorPage from "@/app/blog/error";
//@ts-expect-error
import NotFound from "@/app/blog/not-found";
//@ts-expect-error
import Post from "@/app/blog/[slug]/page";

describe("Tests for Error Handling", () => {
  describe("Tests for error.jsx", () => {
    it("Is a Client Component", () => {
      const firstLine = readFileSync("app/blog/error.jsx", "utf-8").trim().split("\n")[0].trim();
      expect(firstLine.replace(/;$/, "")).toMatch(/^["']use client["']$/);
    });

    it("Renders the error message", () => {
      const { container } = render(
        //@ts-expect-error
        <ErrorPage error={new Error("Database unreachable")} reset={() => {}} />
      );
      expect(container.querySelector("p#error")?.textContent).toBe("Database unreachable");
    });

    it("Offers a retry that calls reset", () => {
      const reset = vi.fn();
      //@ts-expect-error
      const { container } = render(<ErrorPage error={new Error("boom")} reset={reset} />);
      const button = container.querySelector("button#retry")!;

      expect(button.textContent).toBe("Try again");
      fireEvent.click(button);
      expect(reset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Tests for not-found.jsx", () => {
    it("Renders the heading and a way back", () => {
      //@ts-expect-error
      const { container } = render(<NotFound />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Post not found");

      const link = container.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/blog");
      expect(link?.textContent).toBe("Back to the blog");
    });
  });

  describe("Tests for the post page", () => {
    it("Renders a post that exists", async () => {
      const { container } = render(await Post({ params: Promise.resolve({ slug: "routing" }) }));
      expect(container.querySelector("h1#title")?.textContent).toBe("Routing in Next.js");
      expect(container.querySelector("p#body")?.textContent).toBe("Folders all the way down");
    });

    it("Calls notFound for a slug with no post", async () => {
      let thrown: any;
      try {
        await Post({ params: Promise.resolve({ slug: "nope" }) });
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeTruthy();
      expect(String(thrown.digest ?? thrown.message)).toMatch(/NEXT_NOT_FOUND|404/);
    });
  });
});
