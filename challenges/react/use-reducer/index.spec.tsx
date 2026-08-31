import { describe, it, expect } from "vitest";
//@ts-expect-error
import { initialState, todosReducer } from "./src/reducers/todos-reducer";
//@ts-expect-error
import Todos from "./src/components/todos";
import { render, fireEvent } from "@testing-library/react";

const addTodo = (container: HTMLElement, text: string) => {
  fireEvent.change(container.querySelector("input#todo-input")!, {
    target: { value: text },
  });
  fireEvent.submit(container.querySelector("form#todo-form")!);
};

describe("Tests for Reducers challenge", () => {
  describe("Tests for todosReducer", () => {
    it("Starts with no todos", () => {
      expect(initialState).toEqual([]);
    });

    it("Adds a todo", () => {
      const state = todosReducer([], { type: "added", id: "1", text: "ship it" });
      expect(state).toEqual([{ id: "1", text: "ship it", done: false }]);
    });

    it("Toggles a todo", () => {
      const state = todosReducer([{ id: "1", text: "ship it", done: false }], {
        type: "toggled",
        id: "1",
      });
      expect(state[0].done).toBe(true);
      expect(todosReducer(state, { type: "toggled", id: "1" })[0].done).toBe(false);
    });

    it("Deletes a todo", () => {
      const state = todosReducer(
        [
          { id: "1", text: "one", done: false },
          { id: "2", text: "two", done: false },
        ],
        { type: "deleted", id: "1" }
      );
      expect(state).toEqual([{ id: "2", text: "two", done: false }]);
    });

    it("Is pure and never mutates the state it is given", () => {
      const state = [{ id: "1", text: "one", done: false }];
      const next = todosReducer(state, { type: "toggled", id: "1" });
      expect(state).toEqual([{ id: "1", text: "one", done: false }]);
      expect(next).not.toBe(state);
      expect(todosReducer(state, { type: "added", id: "2", text: "two" })).not.toBe(
        state
      );
      expect(state).toHaveLength(1);
    });

    it("Throws on an unknown action", () => {
      expect(() => todosReducer([], { type: "exploded" })).toThrow();
    });
  });

  describe("Tests for Todos", () => {
    it("Renders an empty list", () => {
      //@ts-expect-error
      const { container } = render(<Todos />);
      expect(container.querySelector("form#todo-form")).toBeTruthy();
      expect(container.querySelector("input#todo-input")).toBeTruthy();
      expect(container.querySelectorAll("ul#todos li")).toHaveLength(0);
    });

    it("Adds a todo and clears the input", () => {
      //@ts-expect-error
      const { container } = render(<Todos />);
      addTodo(container, "ship it");
      expect(container.querySelectorAll("ul#todos li")).toHaveLength(1);
      expect(container.querySelector("ul#todos li span")?.textContent).toBe("ship it");
      expect(
        (container.querySelector("input#todo-input") as HTMLInputElement).value
      ).toBe("");
    });

    it("Ignores empty submissions", () => {
      //@ts-expect-error
      const { container } = render(<Todos />);
      addTodo(container, "   ");
      expect(container.querySelectorAll("ul#todos li")).toHaveLength(0);
    });

    it("Toggles a todo", () => {
      //@ts-expect-error
      const { container } = render(<Todos />);
      addTodo(container, "ship it");
      fireEvent.click(container.querySelector("ul#todos li button.toggle")!);
      const span = container.querySelector("ul#todos li span") as HTMLElement;
      expect(span.style.textDecoration).toContain("line-through");
      fireEvent.click(container.querySelector("ul#todos li button.toggle")!);
      expect(
        (container.querySelector("ul#todos li span") as HTMLElement).style
          .textDecoration
      ).not.toContain("line-through");
    });

    it("Deletes the right todo", () => {
      //@ts-expect-error
      const { container } = render(<Todos />);
      addTodo(container, "one");
      addTodo(container, "two");
      expect(container.querySelectorAll("ul#todos li")).toHaveLength(2);
      fireEvent.click(container.querySelectorAll("ul#todos li button.delete")[0]);
      expect(
        [...container.querySelectorAll("ul#todos li span")].map((s) => s.textContent)
      ).toEqual(["two"]);
    });
  });
});
