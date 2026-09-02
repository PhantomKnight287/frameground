import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Page from "@/app/users/[id]/page";
//@ts-expect-error
import { calls, resetCalls } from "@/lib/api";

const renderPage = async (id: string) =>
  render(await Page({ params: Promise.resolve({ id }) }));

describe("Tests for Server Components", () => {
  beforeEach(() => {
    resetCalls();
  });

  describe("Rendering the user", () => {
    it("Renders the name and email", async () => {
      const { container } = await renderPage("1");
      expect(container.querySelector("h1#name")?.textContent).toBe("Ada Lovelace");
      expect(container.querySelector("p#email")?.textContent).toBe("ada@example.com");
    });

    it("Renders one item per post", async () => {
      const { container } = await renderPage("1");
      const items = container.querySelectorAll("ul#posts li");
      expect([...items].map((li) => li.textContent)).toEqual([
        "On the Analytical Engine",
        "Note G",
      ]);
    });

    it("Renders an empty state instead of the list", async () => {
      const { container } = await renderPage("2");
      expect(container.querySelector("p#empty")?.textContent).toBe("No posts yet");
      expect(container.querySelector("ul#posts")).toBeNull();
    });
  });

  describe("Fetching", () => {
    it("Loads the user and the posts", async () => {
      await renderPage("1");
      expect(calls).toContain("getUser:start");
      expect(calls).toContain("getPosts:start");
    });

    it("Starts both requests before waiting on either", async () => {
      await renderPage("1");
      const firstEnd = calls.findIndex((call: string) => call.endsWith(":end"));
      const starts = calls.slice(0, firstEnd).filter((call: string) => call.endsWith(":start"));

      expect(starts).toHaveLength(2);
    });

    it("Does not fetch anything twice", async () => {
      await renderPage("1");
      expect(calls.filter((call: string) => call === "getUser:start")).toHaveLength(1);
      expect(calls.filter((call: string) => call === "getPosts:start")).toHaveLength(1);
    });
  });
});
