import { it, describe, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import StyleSheet from "./src/components/StyleSheet";
//@ts-expect-error
import StylesheetModule from "./src/components/Module";
//@ts-expect-error
import Inline from "./src/components/Inline";

describe("Tests for Css Files", () => {
  it('Must contain an h1 with class "heading"', () => {
    //@ts-expect-error
    const { container } = render(<StyleSheet />);
    expect(container.querySelector(".heading")).toBeDefined();
  });
});

describe("Tests for Css Modules", () => {
  it("Must have a class attached", () => {
    //@ts-expect-error
    const { getByTestId } = render(<StylesheetModule />);
    const element = getByTestId("css_module_target");
    expect(Array.from(element.className).length).toBeGreaterThan(0);
  });
});

describe("Tests for Inline Css", () => {
  //@ts-expect-error
  const { getByTestId } = render(<Inline />);
  const element = getByTestId("inline_css_target");
  it("Must have a background color", () => {
    expect(element.style.backgroundColor).toBeTruthy();
  });
  it("Must have a font size", () => {
    expect(element.style.fontSize).toBeTruthy();
  });
});
