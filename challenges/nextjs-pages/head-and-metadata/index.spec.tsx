import { describe, it, expect } from "vitest";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime";
//@ts-expect-error
import Seo from "@/components/seo";
//@ts-expect-error
import Home from "@/pages/index";

/**
 * `next/head` hands its children to the head manager instead of touching the DOM,
 * so the tests provide a fake one and inspect what the page tried to render.
 */
function renderWithHead(ui: ReactElement) {
  let head: any[] = [];
  const headManager = {
    updateHead: (state: any[]) => {
      head = state;
    },
    mountedInstances: new Set(),
  };
  const result = render(
    //@ts-expect-error
    <HeadManagerContext.Provider value={headManager}>{ui}</HeadManagerContext.Provider>
  );
  // the two defaults Next.js always injects are not part of the challenge
  const tags = head.filter(
    (tag: any) => !(tag.type === "meta" && (tag.props.charSet || tag.props.name === "viewport"))
  );
  return { ...result, head: tags };
}

// React escapes ":" in keys, so compare against the decoded form
const keyOf = (tag: any) => String(tag?.key ?? "").replace(/=2/g, ":");

const find = (head: any[], type: string, match: Record<string, string> = {}) =>
  head.find(
    (tag: any) =>
      tag.type === type && Object.entries(match).every(([k, v]) => tag.props[k] === v)
  );

describe("Tests for Head and Metadata", () => {
  describe("Tests for Seo", () => {
    it("Renders the title with the site name appended", () => {
      const { head } = renderWithHead(
        //@ts-expect-error
        <Seo title="Blog" description="Posts about the web" />
      );
      const title = find(head, "title");
      expect(title).toBeTruthy();
      expect(title.props.children).toBe("Blog | FrameGround");
    });

    it("Renders the meta description", () => {
      const { head } = renderWithHead(
        //@ts-expect-error
        <Seo title="Blog" description="Posts about the web" />
      );
      expect(find(head, "meta", { name: "description" })?.props.content).toBe(
        "Posts about the web"
      );
    });

    it("Renders keyed Open Graph tags", () => {
      const { head } = renderWithHead(
        //@ts-expect-error
        <Seo title="Blog" description="Posts about the web" />
      );
      const ogTitle = find(head, "meta", { property: "og:title" });
      const ogDescription = find(head, "meta", { property: "og:description" });

      expect(ogTitle?.props.content).toBe("Blog");
      expect(keyOf(ogTitle)).toContain("og:title");
      expect(ogDescription?.props.content).toBe("Posts about the web");
      expect(keyOf(ogDescription)).toContain("og:description");
    });

    it("Adds nothing else to the head", () => {
      const { head } = renderWithHead(
        //@ts-expect-error
        <Seo title="Blog" description="Posts about the web" />
      );
      expect(head).toHaveLength(4);
    });
  });

  describe("Tests for the home page", () => {
    it("Renders its heading", () => {
      //@ts-expect-error
      const { container } = renderWithHead(<Home />);
      expect(container.querySelector("h1#title")?.textContent).toBe("Home");
    });

    it("Describes itself through Seo", () => {
      //@ts-expect-error
      const { head } = renderWithHead(<Home />);
      expect(find(head, "title")?.props.children).toBe("Home | FrameGround");
      expect(find(head, "meta", { name: "description" })?.props.content).toBe(
        "Learn Next.js by building"
      );
      expect(find(head, "meta", { property: "og:title" })?.props.content).toBe("Home");
    });
  });
});
