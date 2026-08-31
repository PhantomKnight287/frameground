import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
//@ts-expect-error
import UserList from "./src/components/user-list";
import { render, waitFor } from "@testing-library/react";

const users = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Grace" },
];

const jsonResponse = (data: unknown, ok = true) =>
  ({ ok, json: () => Promise.resolve(data) }) as Response;

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
};

describe("Tests for Data Fetching challenge", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it("Renders the loading state first", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    //@ts-expect-error
    const { container } = render(<UserList url="/api/users" />);
    expect(container.querySelector("p#loading")?.textContent).toBe("Loading...");
    expect(container.querySelector("ul#users")).toBeFalsy();
    expect(container.querySelector("p#error")).toBeFalsy();
  });

  it("Fetches the url it is given", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    //@ts-expect-error
    render(<UserList url="/api/users" />);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch as any).mock.calls[0][0]).toBe("/api/users");
  });

  it("Renders the users once the request resolves", async () => {
    (fetch as any).mockResolvedValue(jsonResponse(users));
    //@ts-expect-error
    const { container } = render(<UserList url="/api/users" />);

    await waitFor(() => expect(container.querySelector("ul#users")).toBeTruthy());
    expect(
      [...container.querySelectorAll("ul#users li")].map((li) => li.textContent)
    ).toEqual(["Ada", "Grace"]);
    expect(container.querySelector("p#loading")).toBeFalsy();
    expect(container.querySelector("p#error")).toBeFalsy();
  });

  it("Renders the error state when the request rejects", async () => {
    (fetch as any).mockRejectedValue(new Error("offline"));
    //@ts-expect-error
    const { container } = render(<UserList url="/api/users" />);

    await waitFor(() => expect(container.querySelector("p#error")).toBeTruthy());
    expect(container.querySelector("p#error")?.textContent).toBe(
      "Something went wrong"
    );
    expect(container.querySelector("p#loading")).toBeFalsy();
    expect(container.querySelector("ul#users")).toBeFalsy();
  });

  it("Treats a non ok response as an error", async () => {
    (fetch as any).mockResolvedValue(jsonResponse({ message: "nope" }, false));
    //@ts-expect-error
    const { container } = render(<UserList url="/api/users" />);

    await waitFor(() => expect(container.querySelector("p#error")).toBeTruthy());
    expect(container.querySelector("ul#users")).toBeFalsy();
  });

  it("Refetches when the url changes", async () => {
    (fetch as any).mockResolvedValue(jsonResponse(users));
    //@ts-expect-error
    const { rerender } = render(<UserList url="/api/users" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    //@ts-expect-error
    rerender(<UserList url="/api/admins" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect((fetch as any).mock.calls[1][0]).toBe("/api/admins");
  });

  it("Ignores the response of a stale request", async () => {
    const slow = deferred<Response>();
    (fetch as any)
      .mockReturnValueOnce(slow.promise)
      .mockResolvedValueOnce(jsonResponse([{ id: 3, name: "Alan" }]));

    //@ts-expect-error
    const { container, rerender } = render(<UserList url="/api/users" />);
    //@ts-expect-error
    rerender(<UserList url="/api/admins" />);

    await waitFor(() => expect(container.querySelector("ul#users")).toBeTruthy());
    // the first request lands last, but it belongs to a url we no longer show
    slow.resolve(jsonResponse(users));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(
      [...container.querySelectorAll("ul#users li")].map((li) => li.textContent)
    ).toEqual(["Alan"]);
  });
});
