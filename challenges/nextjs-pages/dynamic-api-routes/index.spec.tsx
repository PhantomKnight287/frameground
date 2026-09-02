import { describe, it, expect, vi } from "vitest";
//@ts-expect-error
import handler from "@/pages/api/posts/[id]";
//@ts-expect-error
import { getPost, getPosts } from "@/lib/posts";

function mockRes() {
  const res: any = {
    statusCode: undefined,
    body: undefined,
    headers: {} as Record<string, unknown>,
    status: vi.fn((code: number) => {
      res.statusCode = code;
      return res;
    }),
    json: vi.fn((data: unknown) => {
      res.body = data;
      return res;
    }),
    setHeader: vi.fn((name: string, value: unknown) => {
      res.headers[name] = value;
      return res;
    }),
    end: vi.fn(() => res),
  };
  return res;
}

const call = async (method: string, id: string, body: Record<string, unknown> = {}) => {
  const res = mockRes();
  await handler({ method, query: { id }, body }, res);
  return res;
};

describe("Tests for Dynamic API Routes", () => {
  describe("GET", () => {
    it("Responds with the post", async () => {
      const res = await call("GET", "1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ post: { id: 1, title: "Hello World" } });
    });

    it("Looks the post up by the string id from the URL", async () => {
      const res = await call("GET", "2");
      expect(res.body.post.id).toBe(2);
    });

    it("Responds with 404 for an unknown id", async () => {
      const res = await call("GET", "999");
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Post not found" });
    });
  });

  describe("PATCH", () => {
    it("Updates the title", async () => {
      const res = await call("PATCH", "1", { title: "Renamed" });
      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe("Renamed");
      expect(getPost("1").title).toBe("Renamed");
    });

    it("Requires a title", async () => {
      const res = await call("PATCH", "2", {});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "title is required" });
    });

    it("Responds with 404 before validating the body", async () => {
      const res = await call("PATCH", "999", {});
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Post not found" });
    });
  });

  describe("DELETE", () => {
    it("Deletes the post and responds with 204 and no body", async () => {
      const before = getPosts().length;
      const res = await call("DELETE", "2");

      expect(res.statusCode).toBe(204);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
      expect(getPosts()).toHaveLength(before - 1);
    });

    it("Responds with 404 for an unknown id", async () => {
      const res = await call("DELETE", "999");
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Post not found" });
    });
  });

  describe("Other methods", () => {
    it("Responds with 405 and an Allow header", async () => {
      const res = await call("POST", "1", { title: "nope" });
      expect(res.statusCode).toBe(405);
      expect(res.body).toEqual({ error: "Method POST not allowed" });
      expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET", "PATCH", "DELETE"]);
    });
  });
});
