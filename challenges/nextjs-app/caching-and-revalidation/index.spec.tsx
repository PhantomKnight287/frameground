import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// hoisted so the mock factory - which vitest lifts above the imports - can see them
const { revalidateTag, revalidatePath } = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidateTag, revalidatePath }));

//@ts-expect-error
import Blog from "@/app/blog/page";
//@ts-expect-error
import { POST } from "@/app/api/revalidate/route";

const posts = [
  { id: 1, title: "Hello World" },
  { id: 2, title: "Routing in Next.js" },
];

const request = (body: unknown) =>
  new Request("https://frameground.test/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("Tests for Caching and Revalidation", () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => posts })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Tests for the blog page", () => {
    it("Fetches the posts API", async () => {
      await Blog();
      expect(String((fetch as any).mock.calls[0][0])).toBe("https://api.example.com/posts");
    });

    it("Caches the response for a minute", async () => {
      await Blog();
      const options = (fetch as any).mock.calls[0][1];
      expect(options?.next?.revalidate).toBe(60);
    });

    it("Tags the cache entry", async () => {
      await Blog();
      const options = (fetch as any).mock.calls[0][1];
      expect(options?.next?.tags).toEqual(["posts"]);
    });

    it("Renders the posts", async () => {
      const { container } = render(await Blog());
      expect(container.querySelector("h1#title")?.textContent).toBe("Blog");
      expect([...container.querySelectorAll("ul#posts li")].map((li) => li.textContent)).toEqual([
        "Hello World",
        "Routing in Next.js",
      ]);
    });
  });

  describe("Tests for the revalidate endpoint", () => {
    it("Rejects a body with no tag", async () => {
      const response = await POST(request({}));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "tag is required" });
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("Revalidates the tag it was given", async () => {
      const response = await POST(request({ tag: "posts" }));

      expect(revalidateTag).toHaveBeenCalledWith("posts");
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ revalidated: true, tag: "posts" });
    });

    it("Works for any tag", async () => {
      await POST(request({ tag: "products" }));
      expect(revalidateTag).toHaveBeenCalledWith("products");
    });
  });
});
