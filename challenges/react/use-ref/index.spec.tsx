import { describe, it, expect } from "vitest";
//@ts-expect-error
import FocusInput from "./src/components/focus-input";
//@ts-expect-error
import PreviousValue from "./src/components/previous-value";
import { render, fireEvent } from "@testing-library/react";

describe("Tests for Refs challenge", () => {
  describe("Tests for FocusInput", () => {
    it("Renders an input and a button", () => {
      //@ts-expect-error
      const { container } = render(<FocusInput />);
      expect(container.querySelector("input#name")).toBeTruthy();
      expect(container.querySelector("button#focus")).toBeTruthy();
    });

    it("Focuses the input when the button is clicked", () => {
      //@ts-expect-error
      const { container } = render(<FocusInput />, {
        // the element must be in the document for focus to move
        container: document.body.appendChild(document.createElement("div")),
      });
      const input = container.querySelector("input#name")!;
      expect(document.activeElement).not.toBe(input);
      fireEvent.click(container.querySelector("button#focus")!);
      expect(document.activeElement).toBe(input);
    });
  });

  describe("Tests for PreviousValue", () => {
    it("Renders the current value", () => {
      //@ts-expect-error
      const { container } = render(<PreviousValue value="one" />);
      expect(container.querySelector("span#current")?.textContent).toBe(
        "Current: one"
      );
    });

    it("Has no previous value on the first render", () => {
      //@ts-expect-error
      const { container } = render(<PreviousValue value="one" />);
      expect(container.querySelector("span#previous")?.textContent).toBe(
        "Previous: none"
      );
    });

    it("Remembers the value from the last render", () => {
      //@ts-expect-error
      const { container, rerender } = render(<PreviousValue value="one" />);
      //@ts-expect-error
      rerender(<PreviousValue value="two" />);
      expect(container.querySelector("span#current")?.textContent).toBe(
        "Current: two"
      );
      expect(container.querySelector("span#previous")?.textContent).toBe(
        "Previous: one"
      );
      //@ts-expect-error
      rerender(<PreviousValue value="three" />);
      expect(container.querySelector("span#previous")?.textContent).toBe(
        "Previous: two"
      );
    });
  });
});
