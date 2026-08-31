import { describe, it, expect } from "vitest";
//@ts-expect-error
import Card from "./src/components/card";
//@ts-expect-error
import SplitPane from "./src/components/split-pane";
import { render } from "@testing-library/react";

describe("Tests for Composition challenge", () => {
  describe("Tests for Card", () => {
    it("Renders its children in the body", () => {
      const { container } = render(
        //@ts-expect-error
        <Card>
          <p id="content">Hello</p>
        </Card>
      );
      expect(container.querySelector("div.card")).toBeTruthy();
      expect(container.querySelector("div.card-body #content")?.textContent).toBe(
        "Hello"
      );
    });

    it("Renders no header or footer when they are not passed", () => {
      //@ts-expect-error
      const { container } = render(<Card>Hello</Card>);
      expect(container.querySelector("div.card-header")).toBeFalsy();
      expect(container.querySelector("div.card-footer")).toBeFalsy();
    });

    it("Renders a text title and footer", () => {
      const { container } = render(
        //@ts-expect-error
        <Card title="Ada" footer="1815">
          Hello
        </Card>
      );
      expect(container.querySelector("div.card-header")?.textContent).toBe("Ada");
      expect(container.querySelector("div.card-footer")?.textContent).toBe("1815");
    });

    it("Accepts JSX for the title and the footer", () => {
      const { container } = render(
        //@ts-expect-error
        <Card title={<h2 id="heading">Ada</h2>} footer={<button id="save">Save</button>}>
          Hello
        </Card>
      );
      expect(container.querySelector(".card-header #heading")?.textContent).toBe("Ada");
      expect(container.querySelector(".card-footer #save")?.textContent).toBe("Save");
    });

    it("Renders several children", () => {
      const { container } = render(
        //@ts-expect-error
        <Card>
          <p id="one">One</p>
          <p id="two">Two</p>
        </Card>
      );
      expect(container.querySelectorAll("div.card-body p")).toHaveLength(2);
    });
  });

  describe("Tests for SplitPane", () => {
    it("Renders each pane in its own slot", () => {
      const { container } = render(
        //@ts-expect-error
        <SplitPane left={<p id="nav">Nav</p>} right={<p id="article">Article</p>} />
      );
      expect(container.querySelector("div#split")).toBeTruthy();
      expect(container.querySelector("#left #nav")?.textContent).toBe("Nav");
      expect(container.querySelector("#right #article")?.textContent).toBe("Article");
      expect(container.querySelector("#left #article")).toBeFalsy();
    });
  });
});
