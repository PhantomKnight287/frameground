import { render } from "@testing-library/react";
import { it } from "vitest";
import { describe } from "vitest";
//@ts-expect-error
import Greet from "./src/components/greet";
import { expect } from "vitest";
//@ts-expect-error
import Age from "./src/components/age";

describe("Tests for props", () => {
  it('Should render "Hello World"', () => {
    //@ts-expect-error
    const { container } = render(<Greet name={"World"} />);
    expect(container.querySelector("div")?.innerHTML).toBe("Hello World");
  });
  it('Should render "My age is 69"', () => {
    //@ts-expect-error
    const { container } = render(<Age age={69} />);
    expect(container.querySelector("div")?.innerHTML).toBe("My age is 69");
  });
});
