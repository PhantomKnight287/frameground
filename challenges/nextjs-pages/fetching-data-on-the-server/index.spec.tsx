import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Users, { getServerSideProps } from "@/pages/users";

const apiUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "leanne@example.com",
    address: { city: "Gwenborough" },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "ervin@example.com",
    address: { city: "Wisokyburgh" },
  },
];

const context = () => ({ query: {}, req: { cookies: {}, headers: {} }, res: { setHeader: vi.fn() } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Tests for Fetching Data on the Server", () => {
  describe("Tests for getServerSideProps", () => {
    it("Fetches the users API", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => apiUsers });
      vi.stubGlobal("fetch", fetchMock);

      await getServerSideProps(context());

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(String(fetchMock.mock.calls[0][0])).toBe(
        "https://jsonplaceholder.typicode.com/users"
      );
    });

    it("Returns only the fields the page renders", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => apiUsers })
      );

      const result = await getServerSideProps(context());

      expect(result.props.error).toBeNull();
      expect(result.props.users).toEqual([
        { id: 1, name: "Leanne Graham", email: "leanne@example.com" },
        { id: 2, name: "Ervin Howell", email: "ervin@example.com" },
      ]);
    });

    it("Handles a failing response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => {
            throw new Error("no body");
          },
        })
      );

      const result = await getServerSideProps(context());

      expect(result.props.users).toEqual([]);
      expect(result.props.error).toBe("Failed to load users");
    });

    it("Handles fetch rejecting", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

      const result = await getServerSideProps(context());

      expect(result.props.users).toEqual([]);
      expect(result.props.error).toBe("Failed to load users");
    });
  });

  describe("Tests for the page", () => {
    const users = [
      { id: 1, name: "Leanne Graham", email: "leanne@example.com" },
      { id: 2, name: "Ervin Howell", email: "ervin@example.com" },
    ];

    it("Renders one item per user", () => {
      //@ts-expect-error
      const { container } = render(<Users users={users} error={null} />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Users");
      const items = container.querySelectorAll("ul#users li");
      expect([...items].map((li) => li.textContent)).toEqual([
        "Leanne Graham (leanne@example.com)",
        "Ervin Howell (ervin@example.com)",
      ]);
    });

    it("Renders the error instead of the list", () => {
      //@ts-expect-error
      const { container } = render(<Users users={[]} error="Failed to load users" />);
      expect(container.querySelector("p#error")?.textContent).toBe("Failed to load users");
      expect(container.querySelector("ul#users")).toBeNull();
    });
  });
});
