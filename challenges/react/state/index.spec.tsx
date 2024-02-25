import { describe, it, expect } from "vitest";
//@ts-expect-error
import { ClassState } from "./src/components/class-state";
//@ts-expect-error
import FunctionalState from "./src/components/functional-state";
import { render, fireEvent } from "@testing-library/react";

describe("Tests for State challenge", () => {
  describe("Tests for Class Components", () => {
    it("Default export is a class component from `src/components/class-state.jsx`", () => {
      expect(ClassState?.prototype?.isReactComponent).toBeTruthy();
    });

    it("Renders 2 buttons and 1 span", () => {
      //@ts-expect-error
      const { container } = render(<ClassState />);
      expect(container.querySelector("span#likes")).toBeTruthy();
      expect(container.querySelector("button#increase")).toBeTruthy();
      expect(container.querySelector("button#decrease")).toBeTruthy();
    });

    it("Default likes are 0", () => {
      //@ts-expect-error
      const { container } = render(<ClassState />);
      expect(container.querySelector("span#likes")?.innerHTML).toBe(
        "Current likes: 0"
      );
    });
    it("Likes increase on click", () => {
      //@ts-expect-error
      const { container } = render(<ClassState />);
      fireEvent.click(container.querySelector("button#increase"));
      expect(container.querySelector("span#likes")).toBeTruthy();
    });

    it("Likes decrease on click", () => {
      //@ts-expect-error
      const { container } = render(<ClassState />);
      fireEvent.click(container.querySelector("button#increase"));
      fireEvent.click(container.querySelector("button#increase"));
      fireEvent.click(container.querySelector("button#increase"));
      fireEvent.click(container.querySelector("button#increase"));
      fireEvent.click(container.querySelector("button#decrease"));
      expect(container.querySelector("span#likes")?.innerHTML).toBe(
        "Current likes: 3"
      );
    });
  });

  describe("Tests for Function Components", () => {
    const colors = ["#FF5733", "#48C9B0", "#9B59B6", "#F7DC6F", "#2E86C1"];

    it("Default export is a functional component from `src/components/functional-state.jsx`", () => {
      expect(FunctionalState?.prototype?.isReactComponent).toBeFalsy();
    });

    it("Renders 1 button and 1 span", () => {
      //@ts-expect-error
      const { container } = render(<FunctionalState />);
      expect(container.querySelector("span#currentColor")).toBeTruthy();
      expect(container.querySelector("button#change")).toBeTruthy();
    });
    it(`Default color is ${colors[0]}`, () => {
      //@ts-expect-error
      const { container } = render(<FunctionalState />);
      expect(container.querySelector("span#currentColor")?.innerHTML).toBe(
        `Current Color: ${colors[0]}`
      );
    });

    it("Color changes on button click and color is in array", () => {
      //@ts-expect-error
      const { container } = render(<FunctionalState />);
      fireEvent.click(container.querySelector("button#change"));
      expect(colors).toContain(
        container
          .querySelector("span#currentColor")
          ?.innerHTML.replace("Current Color: ", "")
      );
    });
  });
});
