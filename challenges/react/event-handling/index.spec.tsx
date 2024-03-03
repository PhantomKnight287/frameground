import { render, fireEvent } from "@testing-library/react";
import { it, describe, expect } from "vitest";
//@ts-expect-error
import Input from "./src/components/input";

describe("Tests for Event Handling", () => {
  const setup = () => {
    //@ts-expect-error
    const utils = render(<Input />);
    const input = utils.container.querySelector('input[type="text"]');
    return {
      input,
      ...utils,
    };
  };
  it("Should Show Content Typed in Input in DOM", () => {
    const { input, container } = setup();
    const textToType = "Hello World";
    fireEvent.change(input, { target: { value: textToType } });
    expect(container.querySelector("span#content")?.innerHTML).toBe(textToType);
  });
});
