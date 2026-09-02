import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import Stats, { getStaticProps } from "@/pages/stats";
//@ts-expect-error
import handler from "@/pages/api/revalidate";

function mockRes(revalidate = vi.fn().mockResolvedValue(undefined)) {
  const res: any = {
    statusCode: undefined,
    body: undefined,
    revalidate,
    status: vi.fn((code: number) => {
      res.statusCode = code;
      return res;
    }),
    json: vi.fn((data: unknown) => {
      res.body = data;
      return res;
    }),
    setHeader: vi.fn(),
    end: vi.fn(),
  };
  return res;
}

describe("Tests for Incremental Static Regeneration", () => {
  describe("Tests for the stats page", () => {
    it("Returns the stats as props", async () => {
      const result = await getStaticProps({});
      expect(result.props.stats).toEqual({ challenges: 27, solutions: 1042 });
    });

    it("Regenerates at most once a minute", async () => {
      const result = await getStaticProps({});
      expect(result.revalidate).toBe(60);
    });

    it("Renders the numbers", () => {
      //@ts-expect-error
      const { container } = render(<Stats stats={{ challenges: 3, solutions: 9 }} />);
      expect(container.querySelector("p#challenges")?.textContent).toBe("3");
      expect(container.querySelector("p#solutions")?.textContent).toBe("9");
    });
  });

  describe("Tests for the revalidate endpoint", () => {
    beforeEach(() => {
      vi.stubEnv("REVALIDATE_SECRET", "s3cret");
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("Rejects a request with no secret", async () => {
      const res = mockRes();
      await handler({ method: "POST", query: {}, body: {} }, res);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: "Invalid token" });
      expect(res.revalidate).not.toHaveBeenCalled();
    });

    it("Rejects a request with the wrong secret", async () => {
      const res = mockRes();
      await handler({ method: "POST", query: { secret: "guess" }, body: {} }, res);

      expect(res.statusCode).toBe(401);
      expect(res.revalidate).not.toHaveBeenCalled();
    });

    it("Revalidates the stats page", async () => {
      const res = mockRes();
      await handler({ method: "POST", query: { secret: "s3cret" }, body: {} }, res);

      expect(res.revalidate).toHaveBeenCalledWith("/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ revalidated: true });
    });

    it("Reports a failed revalidation", async () => {
      const res = mockRes(vi.fn().mockRejectedValue(new Error("boom")));
      await handler({ method: "POST", query: { secret: "s3cret" }, body: {} }, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: "Failed to revalidate" });
    });
  });
});
