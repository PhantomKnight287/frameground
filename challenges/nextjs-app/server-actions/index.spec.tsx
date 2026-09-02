import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { render, fireEvent, waitFor } from "@testing-library/react";

// hoisted so the mock factories - which vitest lifts above the imports - can see them
const { revalidatePath, createPostMock } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  createPostMock: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath, revalidateTag: vi.fn() }));
vi.mock("@/app/actions", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, createPost: createPostMock };
});

//@ts-expect-error
import * as actions from "@/app/actions";
//@ts-expect-error
import { getPosts } from "@/lib/posts";
//@ts-expect-error
import PostForm from "@/components/post-form";

const formData = (title?: string) => {
  const data = new FormData();
  if (title !== undefined) data.set("title", title);
  return data;
};

describe("Tests for Server Actions", () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    createPostMock.mockReset();
    createPostMock.mockResolvedValue({});
  });

  describe("Tests for the action file", () => {
    it("Is marked with the use server directive", () => {
      const firstLine = readFileSync("app/actions.js", "utf-8").trim().split("\n")[0].trim();
      expect(firstLine.replace(/;$/, "")).toMatch(/^["']use server["']$/);
    });
  });

  describe("Tests for createPost", () => {
    // the module mock above replaces the export, so the real one is imported directly
    let createPost: any;

    beforeEach(async () => {
      createPost = (await vi.importActual<any>("@/app/actions")).createPost;
    });

    it("Rejects an empty title", async () => {
      const before = getPosts().length;
      const state = await createPost({}, formData(""));

      expect(state).toEqual({ error: "Title is required" });
      expect(getPosts()).toHaveLength(before);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("Rejects a title that is only whitespace", async () => {
      const state = await createPost({}, formData("   "));
      expect(state).toEqual({ error: "Title is required" });
    });

    it("Rejects a missing title", async () => {
      const state = await createPost({}, formData());
      expect(state).toEqual({ error: "Title is required" });
    });

    it("Saves a trimmed title", async () => {
      const before = getPosts().length;
      const state = await createPost({}, formData("  A new post  "));

      expect(state.success).toBe(true);
      expect(state.post.title).toBe("A new post");
      expect(getPosts()).toHaveLength(before + 1);
    });

    it("Revalidates the posts page", async () => {
      await createPost({}, formData("Another post"));
      expect(revalidatePath).toHaveBeenCalledWith("/posts");
    });
  });

  describe("Tests for PostForm", () => {
    it("Is a Client Component", () => {
      const firstLine = readFileSync("components/post-form.jsx", "utf-8")
        .trim()
        .split("\n")[0]
        .trim();
      expect(firstLine.replace(/;$/, "")).toMatch(/^["']use client["']$/);
    });

    it("Renders the form", () => {
      //@ts-expect-error
      const { container } = render(<PostForm />);
      const input = container.querySelector("input#title") as HTMLInputElement;

      expect(container.querySelector("form#post-form")).toBeTruthy();
      expect(input?.getAttribute("name")).toBe("title");
      expect(container.querySelector("button#submit")?.textContent).toBe("Create");
    });

    it("Shows no error before anything is submitted", () => {
      //@ts-expect-error
      const { container } = render(<PostForm />);
      expect(container.querySelector("p#error")).toBeNull();
    });

    it("Runs the action on submit", async () => {
      //@ts-expect-error
      const { container } = render(<PostForm />);
      const input = container.querySelector("input#title") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "From the form" } });
      fireEvent.submit(container.querySelector("form#post-form")!);

      await waitFor(() => expect(createPostMock).toHaveBeenCalled());
      const [, submitted] = createPostMock.mock.calls[0];
      expect(submitted.get("title")).toBe("From the form");
    });

    it("Renders the error the action returned", async () => {
      createPostMock.mockResolvedValue({ error: "Title is required" });

      //@ts-expect-error
      const { container } = render(<PostForm />);
      fireEvent.submit(container.querySelector("form#post-form")!);

      await waitFor(() =>
        expect(container.querySelector("p#error")?.textContent).toBe("Title is required")
      );
    });
  });
});
