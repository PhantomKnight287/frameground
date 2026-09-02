import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
//@ts-expect-error
import App from "@/pages/_app";
//@ts-expect-error
import Layout from "@/components/layout";

function Page({ name }: { name?: string }) {
  return <p id="page">{name ?? "page"}</p>;
}

describe("Tests for Custom App and Layouts", () => {
  describe("Tests for Layout", () => {
    it("Renders the header, content and footer", () => {
      //@ts-expect-error
      const { container } = render(<Layout>{<span id="child" />}</Layout>);
      expect(container.querySelector("header#header h1")?.textContent).toBe("FrameGround");
      expect(container.querySelector("footer#footer")?.textContent).toBe("Built with Next.js");
      expect(container.querySelector("main#content > span#child")).toBeTruthy();
    });
  });

  describe("Tests for _app", () => {
    it("Renders the page component", () => {
      //@ts-expect-error
      const { container } = render(<App Component={Page} pageProps={{}} />);
      expect(container.querySelector("p#page")).toBeTruthy();
    });

    it("Passes pageProps to the page", () => {
      //@ts-expect-error
      const { container } = render(<App Component={Page} pageProps={{ name: "from props" }} />);
      expect(container.querySelector("p#page")?.textContent).toBe("from props");
    });

    it("Wraps the page in the default layout", () => {
      //@ts-expect-error
      const { container } = render(<App Component={Page} pageProps={{}} />);
      expect(container.querySelector("header#header")).toBeTruthy();
      expect(container.querySelector("main#content > p#page")).toBeTruthy();
      expect(container.querySelector("footer#footer")).toBeTruthy();
    });

    it("Uses a per-page layout when the page defines getLayout", () => {
      const Dashboard = () => <p id="page">dashboard</p>;
      //@ts-expect-error
      Dashboard.getLayout = (page: unknown) => <section id="dashboard-layout">{page}</section>;

      //@ts-expect-error
      const { container } = render(<App Component={Dashboard} pageProps={{}} />);
      expect(container.querySelector("section#dashboard-layout > p#page")).toBeTruthy();
      expect(container.querySelector("header#header")).toBeNull();
    });

    it("Still passes pageProps through a per-page layout", () => {
      const Dashboard = ({ name }: { name?: string }) => <p id="page">{name}</p>;
      //@ts-expect-error
      Dashboard.getLayout = (page: unknown) => <section id="dashboard-layout">{page}</section>;

      //@ts-expect-error
      const { container } = render(<App Component={Dashboard} pageProps={{ name: "hi" }} />);
      expect(container.querySelector("p#page")?.textContent).toBe("hi");
    });
  });
});
