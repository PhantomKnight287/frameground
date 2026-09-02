import { describe, it, expect } from "vitest";
//@ts-expect-error
import { GET, POST } from "@/app/api/posts/route";
//@ts-expect-error
import { GET as GET_ONE, DELETE } from "@/app/api/posts/[id]/route";
//@ts-expect-error
import { getPosts } from "@/lib/posts";

const url = (path: string) => `https://frameground.test${path}`;

const context = (id: string) => ({ params: Promise.resolve({ id }) });

describe("Tests for Route Handlers", () => {
  describe("GET /api/posts", () => {
    it("Responds with every post", async () => {
      const response = await GET(new Request(url("/api/posts")));
      expect(response.status).toBe(200);
      expect((await response.json()).posts).toHaveLength(getPosts().length);
    });

    it("Filters on the q search param", async () => {
      const response = await GET(new Request(url("/api/posts?q=routing")));
      const { posts } = await response.json();

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("Routing in Next.js");
    });

    it("Compares case-insensitively", async () => {
      const response = await GET(new Request(url("/api/posts?q=HELLO")));
      expect((await response.json()).posts).toHaveLength(1);
    });
  });

  describe("POST /api/posts", () => {
    it("Creates a post", async () => {
      const before = getPosts().length;
      const response = await POST(
        new Request(url("/api/posts"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ title: "A new post" }),
        })
      );

      expect(response.status).toBe(201);
      expect((await response.json()).post.title).toBe("A new post");
      expect(getPosts()).toHaveLength(before + 1);
    });

    it("Rejects a body with no title", async () => {
      const before = getPosts().length;
      const response = await POST(
        new Request(url("/api/posts"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "title is required" });
      expect(getPosts()).toHaveLength(before);
    });
  });

  describe("GET /api/posts/[id]", () => {
    it("Responds with the post", async () => {
      const response = await GET_ONE(new Request(url("/api/posts/1")), context("1"));
      expect(response.status).toBe(200);
      expect((await response.json()).post).toEqual({ id: 1, title: "Hello World" });
    });

    it("Responds with 404 for an unknown id", async () => {
      const response = await GET_ONE(new Request(url("/api/posts/999")), context("999"));
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Post not found" });
    });
  });

  describe("DELETE /api/posts/[id]", () => {
    it("Deletes the post and responds with 204 and no body", async () => {
      const before = getPosts().length;
      const response = await DELETE(new Request(url("/api/posts/2"), { method: "DELETE" }), context("2"));

      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");
      expect(getPosts()).toHaveLength(before - 1);
    });

    it("Responds with 404 for an unknown id", async () => {
      const response = await DELETE(
        new Request(url("/api/posts/999"), { method: "DELETE" }),
        context("999")
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Post not found" });
    });
  });
});
