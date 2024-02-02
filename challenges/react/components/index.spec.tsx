import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import FunctionalComponent from "./src/functional-component";
//@ts-expect-error
import ClassComponent from "./src/class-component";

describe("Functional Component", () => {
  it('renders "Hello world from functional component"', () => {
    //@ts-expect-error
    const { getByTestId } = render(<FunctionalComponent />);
    expect(getByTestId("test-functional-h1")?.textContent).toBe(
      "Hello world from functional component"
    );
  });
});

describe("Class Component", () => {
  it('renders "Hello world from class component"', () => {
    //@ts-expect-error
    const { getByTestId } = render(<ClassComponent />);
    expect(getByTestId("test-class-h1")?.textContent).toBe(
      "Hello world from class component"
    );
  });
});
