import { describe, it, expect, vi } from "vitest";
//@ts-expect-error
import handler from "@/pages/api/posts";
//@ts-expect-error
import { getPosts } from "@/lib/posts";

/** A minimal stand-in for the Next.js response object. */
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

const call = async (req: Record<string, unknown>) => {
  const res = mockRes();
  await handler({ query: {}, body: {}, ...req }, res);
  return res;
};

describe("Tests for API Routes", () => {
  describe("GET /api/posts", () => {
    it("Responds with 200", async () => {
      const res = await call({ method: "GET" });
      expect(res.statusCode).toBe(200);
    });

    it("Responds with the posts", async () => {
      const res = await call({ method: "GET" });
      expect(res.body).toEqual({ posts: getPosts() });
    });
  });

  describe("POST /api/posts", () => {
    it("Creates a post and responds with 201", async () => {
      const before = getPosts().length;
      const res = await call({ method: "POST", body: { title: "A new post" } });

      expect(res.statusCode).toBe(201);
      expect(res.body.post.title).toBe("A new post");
      expect(res.body.post.id).toBeDefined();
      expect(getPosts()).toHaveLength(before + 1);
    });

    it("Rejects a body with no title", async () => {
      const before = getPosts().length;
      const res = await call({ method: "POST", body: {} });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "title is required" });
      expect(getPosts()).toHaveLength(before);
    });
  });

  describe("Other methods", () => {
    it("Responds with 405", async () => {
      const res = await call({ method: "DELETE" });
      expect(res.statusCode).toBe(405);
      expect(res.body).toEqual({ error: "Method DELETE not allowed" });
    });

    it("Advertises the methods it does allow", async () => {
      const res = await call({ method: "PUT" });
      expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET", "POST"]);
    });
  });
});
