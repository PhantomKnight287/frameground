import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useEffect } from "react";
//@ts-expect-error
import MeasureBox from "./src/components/measure-box";
//@ts-expect-error
import ChatLog from "./src/components/chat-log";
import { render, cleanup } from "@testing-library/react";

// Everything that happens during a commit is recorded here, in order.
const events: string[] = [];

/**
 * A passive effect runs after the browser paints, so anything a layout effect
 * does is recorded before this child's "paint".
 */
function PaintProbe() {
  useEffect(() => {
    events.push("paint");
  });
  return null;
}

const originalRect = HTMLElement.prototype.getBoundingClientRect;
const originalScrollHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollHeight"
);

describe("Tests for Layout Effects challenge", () => {
  beforeEach(() => {
    events.length = 0;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.id === "box") events.push("measure");
      return { width: 120, height: 40 } as DOMRect;
    };
  });

  afterEach(() => {
    cleanup();
    HTMLElement.prototype.getBoundingClientRect = originalRect;
    if (originalScrollHeight)
      Object.defineProperty(HTMLElement.prototype, "scrollHeight", originalScrollHeight);
  });

  describe("Tests for MeasureBox", () => {
    it("Renders its children inside the box", () => {
      const { container } = render(
        //@ts-expect-error
        <MeasureBox>
          <p id="content">Hello</p>
        </MeasureBox>
      );
      expect(container.querySelector("div#box #content")?.textContent).toBe("Hello");
    });

    it("Renders the measured width", () => {
      //@ts-expect-error
      const { container } = render(<MeasureBox>Hello</MeasureBox>);
      expect(container.querySelector("span#width")?.textContent).toBe("Width: 120px");
    });

    it("Measures the box with a ref", () => {
      //@ts-expect-error
      render(<MeasureBox>Hello</MeasureBox>);
      expect(events).toContain("measure");
    });

    it("Measures before the browser paints", () => {
      render(
        //@ts-expect-error
        <MeasureBox>
          <PaintProbe />
        </MeasureBox>
      );
      expect(events).toEqual(["measure", "paint"]);
    });

    it("Re-measures when the children change", () => {
      //@ts-expect-error
      const { container, rerender } = render(<MeasureBox>Hello</MeasureBox>);
      expect(container.querySelector("span#width")?.textContent).toBe("Width: 120px");

      HTMLElement.prototype.getBoundingClientRect = function () {
        return { width: 300, height: 40 } as DOMRect;
      };
      //@ts-expect-error
      rerender(<MeasureBox>Goodbye</MeasureBox>);
      expect(container.querySelector("span#width")?.textContent).toBe("Width: 300px");
    });
  });

  describe("Tests for ChatLog", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
        configurable: true,
        get() {
          return this.querySelectorAll(".message").length * 100;
        },
      });
    });

    it("Renders every message", () => {
      //@ts-expect-error
      const { container } = render(<ChatLog messages={["one", "two"]} />);
      expect(
        [...container.querySelectorAll("div#messages p.message")].map(
          (p) => p.textContent
        )
      ).toEqual(["one", "two"]);
    });

    it("Scrolls to the bottom on mount", () => {
      //@ts-expect-error
      const { container } = render(<ChatLog messages={["one", "two"]} />);
      const list = container.querySelector("div#messages") as HTMLElement;
      expect(list.scrollTop).toBe(200);
    });

    it("Scrolls to the bottom when a message arrives", () => {
      //@ts-expect-error
      const { container, rerender } = render(<ChatLog messages={["one"]} />);
      //@ts-expect-error
      rerender(<ChatLog messages={["one", "two", "three"]} />);
      const list = container.querySelector("div#messages") as HTMLElement;
      expect(list.scrollTop).toBe(300);
    });
  });
});
