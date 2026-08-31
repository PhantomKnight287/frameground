import { describe, it, expect, beforeEach } from "vitest";
//@ts-expect-error
import { useCounter } from "./src/hooks/use-counter";
//@ts-expect-error
import { useLocalStorage } from "./src/hooks/use-local-storage";
//@ts-expect-error
import Counter from "./src/components/counter";
import { render, renderHook, act, fireEvent } from "@testing-library/react";

describe("Tests for Custom Hooks challenge", () => {
  describe("Tests for useCounter", () => {
    it("Starts at 0 by default", () => {
      const { result } = renderHook(() => useCounter());
      expect(result.current.count).toBe(0);
    });

    it("Starts at the initial value", () => {
      const { result } = renderHook(() => useCounter(10));
      expect(result.current.count).toBe(10);
    });

    it("Increments and decrements", () => {
      const { result } = renderHook(() => useCounter(1));
      act(() => result.current.increment());
      act(() => result.current.increment());
      expect(result.current.count).toBe(3);
      act(() => result.current.decrement());
      expect(result.current.count).toBe(2);
    });

    it("Never goes below 0", () => {
      const { result } = renderHook(() => useCounter(0));
      act(() => result.current.decrement());
      expect(result.current.count).toBe(0);
    });

    it("Resets to the initial value", () => {
      const { result } = renderHook(() => useCounter(4));
      act(() => result.current.increment());
      act(() => result.current.reset());
      expect(result.current.count).toBe(4);
    });

    it("Gives every caller its own state", () => {
      const first = renderHook(() => useCounter(0));
      const second = renderHook(() => useCounter(0));
      act(() => first.result.current.increment());
      expect(first.result.current.count).toBe(1);
      expect(second.result.current.count).toBe(0);
    });
  });

  describe("Tests for useLocalStorage", () => {
    beforeEach(() => localStorage.clear());

    it("Falls back to the initial value", () => {
      const { result } = renderHook(() => useLocalStorage("name", "Ada"));
      expect(result.current[0]).toBe("Ada");
    });

    it("Reads the stored value", () => {
      localStorage.setItem("name", JSON.stringify("Grace"));
      const { result } = renderHook(() => useLocalStorage("name", "Ada"));
      expect(result.current[0]).toBe("Grace");
    });

    it("Writes to localStorage as JSON", () => {
      const { result } = renderHook(() => useLocalStorage("todos", []));
      act(() => result.current[1](["ship it"]));
      expect(result.current[0]).toEqual(["ship it"]);
      expect(localStorage.getItem("todos")).toBe(JSON.stringify(["ship it"]));
    });
  });

  describe("Tests for Counter", () => {
    it("Renders the count and the three buttons", () => {
      //@ts-expect-error
      const { container } = render(<Counter />);
      expect(container.querySelector("span#count")?.textContent).toBe("5");
      expect(container.querySelector("button#increment")).toBeTruthy();
      expect(container.querySelector("button#decrement")).toBeTruthy();
      expect(container.querySelector("button#reset")).toBeTruthy();
    });

    it("Uses the hook to update the count", () => {
      //@ts-expect-error
      const { container } = render(<Counter />);
      fireEvent.click(container.querySelector("button#increment")!);
      expect(container.querySelector("span#count")?.textContent).toBe("6");
      fireEvent.click(container.querySelector("button#decrement")!);
      fireEvent.click(container.querySelector("button#decrement")!);
      expect(container.querySelector("span#count")?.textContent).toBe("4");
      fireEvent.click(container.querySelector("button#reset")!);
      expect(container.querySelector("span#count")?.textContent).toBe("5");
    });
  });
});
