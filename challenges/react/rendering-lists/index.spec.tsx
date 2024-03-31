import { it, describe, expect } from "vitest";
import { fireEvent } from "@testing-library/react";
//@ts-expect-error
import { items } from "./src/components/data";
import { render } from "@testing-library/react";
//@ts-expect-error
import TodosTable from "./src/components/table";

describe("Tests for List Rendering", () => {
  it("Renders the proper data", () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const item = items[randomIndex];
    //@ts-expect-error
    const { container } = render(<TodosTable />);
    let trElement;
    container.querySelectorAll("tr").forEach((element) => {
      if (element.id === item.id.toString()) trElement = element;
    });
    expect(trElement).toBeTruthy();
  });
  it("Deletes the item on button press", () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const item = items[randomIndex];
    //@ts-expect-error
    const { container } = render(<TodosTable />);
    const elements = container.querySelectorAll("tr");
    let tr;
    elements.forEach((element) => {
      if (element.id === item.id.toString()) {
        const lastTd = element.querySelector("td:last-child");
        const button = lastTd.querySelector("button");
        fireEvent.click(button);
        tr = Array(container.querySelectorAll("tr")).filter(
          //@ts-expect-error
          (d) => d.id === item.id
        )[0];
      }
    });
    expect(tr).toBeFalsy();
  });
});
