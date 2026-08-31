import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
//@ts-expect-error
import ErrorBoundary from "./src/components/error-boundary";
import { render, fireEvent } from "@testing-library/react";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Kaboom");
  return <p id="safe">All good</p>;
}

describe("Tests for Error Boundaries challenge", () => {
  // React logs every caught error, which would drown the test output
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it("Is a class component", () => {
    expect(ErrorBoundary?.prototype?.isReactComponent).toBeTruthy();
  });

  it("Renders its children when nothing throws", () => {
    const { container } = render(
      //@ts-expect-error
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(container.querySelector("p#safe")?.textContent).toBe("All good");
    expect(container.querySelector("div#error-fallback")).toBeFalsy();
  });

  it("Renders the fallback when a child throws", () => {
    const { container } = render(
      //@ts-expect-error
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(container.querySelector("div#error-fallback")).toBeTruthy();
    expect(container.querySelector("p#error-message")?.textContent).toBe("Kaboom");
    expect(container.querySelector("button#reset")).toBeTruthy();
    expect(container.querySelector("p#safe")).toBeFalsy();
  });

  it("Uses getDerivedStateFromError", () => {
    expect(typeof (ErrorBoundary as any).getDerivedStateFromError).toBe("function");
  });

  it("Reports the error through onError", () => {
    const onError = vi.fn();
    render(
      //@ts-expect-error
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe("Kaboom");
  });

  it("Works without an onError prop", () => {
    expect(() =>
      render(
        //@ts-expect-error
        <ErrorBoundary>
          <Bomb shouldThrow />
        </ErrorBoundary>
      )
    ).not.toThrow();
  });

  it("Renders the children again after a reset", () => {
    let shouldThrow = true;
    function Flaky() {
      if (shouldThrow) throw new Error("Kaboom");
      return <p id="safe">All good</p>;
    }

    const { container } = render(
      //@ts-expect-error
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>
    );
    expect(container.querySelector("div#error-fallback")).toBeTruthy();

    shouldThrow = false;
    fireEvent.click(container.querySelector("button#reset")!);

    expect(container.querySelector("div#error-fallback")).toBeFalsy();
    expect(container.querySelector("p#safe")?.textContent).toBe("All good");
  });
});
