import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
//@ts-expect-error
import DefaultGreet, { Greet } from "./src/components/greet";
//@ts-expect-error
import App from "./src/App";

describe("Tests for Class Components", () => {
  it("Default export in a class component", () => {
    expect(DefaultGreet?.prototype?.isReactComponent).toBeTruthy();
  });

  it("Named export in a class component", () => {
    expect(Greet?.prototype?.isReactComponent).toBeTruthy();
  });
  it("Greets using Default Component", () => {
    //@ts-expect-error
    const { container } = render(<DefaultGreet />);
    expect(container.querySelector("h1")?.innerHTML).toMatch(/^Hello\s(.+)$/);
  });
  it("Greets using Named Export Component", () => {
    //@ts-expect-error
    const { container } = render(<Greet />);
    expect(container.querySelector("h1")?.innerHTML).toMatch(/^Hello\s(.+)$/);
  });
  it("Class components mounted in App component", () => {
    //@ts-expect-error
    const { container } = render(<App />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s[0]?.innerHTML).toMatch(/^Hello\s(.+)$/);
    expect(h1s[1]?.innerHTML).toMatch(/^Hello\s(.+)$/);
  });
});
