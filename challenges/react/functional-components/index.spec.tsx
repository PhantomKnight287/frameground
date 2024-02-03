import { render } from "@testing-library/react";
//@ts-expect-error
import App from "./src/App";
import { it, describe, expect } from "vitest";
//@ts-expect-error
import DefaultGreet, { Greet } from "./src/components/greet";

describe("Functional Components", () => {
  it("Default Exported Greet Component", () => {
    //@ts-expect-error
    const { container } = render(<DefaultGreet />);
    expect(container.querySelector("h1#default")).toBeTruthy();
  });
  it("Named Exported Greet Component", () => {
    //@ts-expect-error
    const { container } = render(<Greet />);
    expect(container.querySelector("h1#named")).toBeTruthy();
  });

  it("Renders Hello World using Default Exported Greet Component", () => {
    //@ts-expect-error
    const { container } = render(<App />);
    expect(container.querySelector("h1#default")?.innerHTML).toMatch(
      /^Hello\s(.+)$/
    );
  });

  it("Renders Hello World using Named Exported Greet Component", () => {
    //@ts-expect-error
    const { container } = render(<App />);
    expect(container.querySelector("h1#named")?.innerHTML).toMatch(
      /^Hello\s(.+)$/
    );
  });
});
