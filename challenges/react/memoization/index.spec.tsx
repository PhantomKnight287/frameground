import { describe, it, expect, beforeEach } from "vitest";
//@ts-expect-error
import ItemList from "./src/components/item-list";
//@ts-expect-error
import { stats as filterStats } from "./src/utils/slow-filter";
//@ts-expect-error
import { stats as rowStats } from "./src/components/item-row";
import { render, fireEvent } from "@testing-library/react";

const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Avocado" },
];

const names = (container: HTMLElement) =>
  [...container.querySelectorAll("ul#items li button.select")].map(
    (button) => button.textContent
  );

describe("Tests for Memoization challenge", () => {
  beforeEach(() => {
    filterStats.calls = 0;
    rowStats.renders = 0;
  });

  it("Renders the input, the selection and every row", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    expect(container.querySelector("input#query")).toBeTruthy();
    expect(container.querySelector("span#selected")?.textContent).toBe(
      "Selected: none"
    );
    expect(names(container)).toEqual(["Apple", "Banana", "Avocado"]);
  });

  it("Filters the rows through slowFilter", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    expect(filterStats.calls).toBeGreaterThan(0);

    fireEvent.change(container.querySelector("input#query")!, {
      target: { value: "av" },
    });
    expect(names(container)).toEqual(["Avocado"]);
  });

  it("Recalculates when the query changes", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    const before = filterStats.calls;
    fireEvent.change(container.querySelector("input#query")!, {
      target: { value: "a" },
    });
    expect(filterStats.calls).toBeGreaterThan(before);
  });

  it("Selects the clicked row", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    fireEvent.click(container.querySelectorAll("ul#items li button.select")[1]);
    expect(container.querySelector("span#selected")?.textContent).toBe(
      "Selected: 2"
    );
  });

  it("Does not re-filter when only the selection changed", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    const before = filterStats.calls;
    fireEvent.click(container.querySelectorAll("ul#items li button.select")[0]);
    expect(container.querySelector("span#selected")?.textContent).toBe(
      "Selected: 1"
    );
    expect(filterStats.calls).toBe(before);
  });

  it("Does not re-render the rows when only the selection changed", () => {
    //@ts-expect-error
    const { container } = render(<ItemList items={items} />);
    const before = rowStats.renders;
    fireEvent.click(container.querySelectorAll("ul#items li button.select")[0]);
    fireEvent.click(container.querySelectorAll("ul#items li button.select")[2]);
    expect(rowStats.renders).toBe(before);
  });
});
