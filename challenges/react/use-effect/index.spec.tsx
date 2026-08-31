import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
//@ts-expect-error
import DocumentTitle from "./src/components/document-title";
//@ts-expect-error
import Timer from "./src/components/timer";
import { render, fireEvent, act } from "@testing-library/react";

describe("Tests for Effects challenge", () => {
  describe("Tests for DocumentTitle", () => {
    it("Renders the count and a button", () => {
      //@ts-expect-error
      const { container } = render(<DocumentTitle />);
      expect(container.querySelector("span#count")?.textContent).toBe("Count: 0");
      expect(container.querySelector("button#increment")).toBeTruthy();
    });

    it("Sets the document title on mount", () => {
      document.title = "";
      //@ts-expect-error
      render(<DocumentTitle />);
      expect(document.title).toBe("Count: 0");
    });

    it("Keeps the document title in sync with the count", () => {
      //@ts-expect-error
      const { container } = render(<DocumentTitle />);
      fireEvent.click(container.querySelector("button#increment")!);
      fireEvent.click(container.querySelector("button#increment")!);
      expect(container.querySelector("span#count")?.textContent).toBe("Count: 2");
      expect(document.title).toBe("Count: 2");
    });
  });

  describe("Tests for Timer", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("Starts at 0 seconds", () => {
      //@ts-expect-error
      const { container } = render(<Timer />);
      expect(container.querySelector("span#seconds")?.textContent).toBe("0s");
    });

    it("Counts one second at a time", () => {
      //@ts-expect-error
      const { container } = render(<Timer />);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(container.querySelector("span#seconds")?.textContent).toBe("3s");
    });

    it("Creates a single interval", () => {
      const setInterval = vi.spyOn(globalThis, "setInterval");
      //@ts-expect-error
      render(<Timer />);
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(setInterval).toHaveBeenCalledTimes(1);
      setInterval.mockRestore();
    });

    it("Clears the interval on unmount", () => {
      const clearInterval = vi.spyOn(globalThis, "clearInterval");
      //@ts-expect-error
      const { unmount } = render(<Timer />);
      unmount();
      expect(clearInterval).toHaveBeenCalled();
      clearInterval.mockRestore();
    });
  });
});
