import { describe, it, expect, vi } from "vitest";
//@ts-expect-error
import SearchInput from "./src/components/search-input";
//@ts-expect-error
import UserList from "./src/components/user-list";
//@ts-expect-error
import UserSearch from "./src/components/user-search";
import { render, fireEvent } from "@testing-library/react";

const users = ["Ada", "Grace", "Alan", "Barbara"];

describe("Tests for Lifting State Up challenge", () => {
  describe("Tests for SearchInput", () => {
    it("Renders an input with the value it is given", () => {
      //@ts-expect-error
      const { container } = render(<SearchInput value="Ada" onChange={() => {}} />);
      const input = container.querySelector("input#search") as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe("Ada");
    });

    it("Calls onChange with the new text", () => {
      const onChange = vi.fn();
      //@ts-expect-error
      const { container } = render(<SearchInput value="" onChange={onChange} />);
      fireEvent.change(container.querySelector("input#search")!, {
        target: { value: "Gr" },
      });
      expect(onChange).toHaveBeenCalledWith("Gr");
    });

    it("Owns no state of its own", () => {
      //@ts-expect-error
      const { container } = render(<SearchInput value="Ada" onChange={() => {}} />);
      fireEvent.change(container.querySelector("input#search")!, {
        target: { value: "Grace" },
      });
      // The parent owns the value, so an ignored onChange must leave it unchanged.
      expect((container.querySelector("input#search") as HTMLInputElement).value).toBe(
        "Ada"
      );
    });
  });

  describe("Tests for UserList", () => {
    it("Renders every user when the query is empty", () => {
      //@ts-expect-error
      const { container } = render(<UserList users={users} query="" />);
      expect(container.querySelectorAll("ul#users li")).toHaveLength(4);
    });

    it("Filters users case insensitively", () => {
      //@ts-expect-error
      const { container } = render(<UserList users={users} query="a" />);
      const items = [...container.querySelectorAll("ul#users li")].map(
        (li) => li.textContent
      );
      expect(items).toEqual(["Ada", "Grace", "Alan", "Barbara"]);

      //@ts-expect-error
      const { container: second } = render(<UserList users={users} query="AL" />);
      expect(
        [...second.querySelectorAll("ul#users li")].map((li) => li.textContent)
      ).toEqual(["Alan"]);
    });

    it("Renders an empty state when nothing matches", () => {
      //@ts-expect-error
      const { container } = render(<UserList users={users} query="zzz" />);
      expect(container.querySelector("ul#users")).toBeFalsy();
      expect(container.querySelector("p#empty")?.textContent).toBe("No users found");
    });
  });

  describe("Tests for UserSearch", () => {
    it("Renders the input, the count and the list", () => {
      //@ts-expect-error
      const { container } = render(<UserSearch users={users} />);
      expect(container.querySelector("input#search")).toBeTruthy();
      expect(container.querySelector("span#count")?.textContent).toBe("4 users");
      expect(container.querySelectorAll("ul#users li")).toHaveLength(4);
    });

    it("Typing filters the list, so the state is shared", () => {
      //@ts-expect-error
      const { container } = render(<UserSearch users={users} />);
      fireEvent.change(container.querySelector("input#search")!, {
        target: { value: "ada" },
      });
      expect((container.querySelector("input#search") as HTMLInputElement).value).toBe(
        "ada"
      );
      expect(container.querySelector("span#count")?.textContent).toBe("1 users");
      expect(
        [...container.querySelectorAll("ul#users li")].map((li) => li.textContent)
      ).toEqual(["Ada"]);
    });

    it("Shows the empty state when no user matches", () => {
      //@ts-expect-error
      const { container } = render(<UserSearch users={users} />);
      fireEvent.change(container.querySelector("input#search")!, {
        target: { value: "zzz" },
      });
      expect(container.querySelector("span#count")?.textContent).toBe("0 users");
      expect(container.querySelector("p#empty")).toBeTruthy();
    });
  });
});
