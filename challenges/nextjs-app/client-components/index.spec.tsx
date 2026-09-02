import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { render, fireEvent } from "@testing-library/react";

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn(), back: vi.fn() }),
  usePathname: () => "/search",
  useSearchParams: () => searchParams,
}));

//@ts-expect-error
import Counter from "@/components/counter";
//@ts-expect-error
import SearchInput from "@/components/search-input";

describe("Tests for Client Components", () => {
  beforeEach(() => {
    push.mockClear();
    searchParams = new URLSearchParams();
  });

  describe("The client boundary", () => {
    it("Marks both components with the use client directive", () => {
      for (const path of ["components/counter.jsx", "components/search-input.jsx"]) {
        const firstLine = readFileSync(path, "utf-8").trim().split("\n")[0].trim();
        expect(firstLine.replace(/;$/, "")).toMatch(/^["']use client["']$/);
      }
    });
  });

  describe("Tests for Counter", () => {
    it("Starts at zero by default", () => {
      //@ts-expect-error
      const { container } = render(<Counter />);
      expect(container.querySelector("span#count")?.textContent).toBe("0");
    });

    it("Starts at the given value", () => {
      //@ts-expect-error
      const { container } = render(<Counter start={5} />);
      expect(container.querySelector("span#count")?.textContent).toBe("5");
    });

    it("Increments on click", () => {
      //@ts-expect-error
      const { container } = render(<Counter start={5} />);
      fireEvent.click(container.querySelector("button#increment")!);
      fireEvent.click(container.querySelector("button#increment")!);
      expect(container.querySelector("span#count")?.textContent).toBe("7");
    });

    it("Resets back to the starting value", () => {
      //@ts-expect-error
      const { container } = render(<Counter start={5} />);
      fireEvent.click(container.querySelector("button#increment")!);
      fireEvent.click(container.querySelector("button#reset")!);
      expect(container.querySelector("span#count")?.textContent).toBe("5");
    });
  });

  describe("Tests for SearchInput", () => {
    it("Starts empty when there is no q param", () => {
      //@ts-expect-error
      const { container } = render(<SearchInput />);
      expect((container.querySelector("input#q") as HTMLInputElement).value).toBe("");
    });

    it("Starts with the current q param", () => {
      searchParams = new URLSearchParams("q=next");
      //@ts-expect-error
      const { container } = render(<SearchInput />);
      expect((container.querySelector("input#q") as HTMLInputElement).value).toBe("next");
    });

    it("Navigates on submit", () => {
      //@ts-expect-error
      const { container } = render(<SearchInput />);
      const input = container.querySelector("input#q") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "server components" } });
      fireEvent.submit(container.querySelector("form#search-form")!);

      expect(push).toHaveBeenCalledWith("/search?q=server components");
    });

    it("Does not reload the page", () => {
      //@ts-expect-error
      const { container } = render(<SearchInput />);
      const event = new Event("submit", { bubbles: true, cancelable: true });
      container.querySelector("form#search-form")!.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });
});
