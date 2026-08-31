import { describe, it, expect, afterEach } from "vitest";
//@ts-expect-error
import SettingsPanel from "./src/components/settings-panel";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";

// The module registry is shared by the whole test file, so a module imported by
// one test stays imported for the next one.
const importCount = async () =>
  //@ts-expect-error
  (await import("./src/components/settings")).stats.imported;

describe("Tests for Code Splitting challenge", () => {
  afterEach(cleanup);

  it("Renders only the button at first", () => {
    //@ts-expect-error
    const { container } = render(<SettingsPanel />);
    expect(container.querySelector("button#open")).toBeTruthy();
    expect(container.querySelector("p#settings")).toBeFalsy();
    expect(container.querySelector("p#loading")).toBeFalsy();
  });

  it("Shows the fallback and then the panel", async () => {
    //@ts-expect-error
    const { container } = render(<SettingsPanel />);
    fireEvent.click(container.querySelector("button#open")!);

    expect(container.querySelector("p#loading")?.textContent).toBe("Loading...");

    await waitFor(() =>
      expect(container.querySelector("p#settings")?.textContent).toBe(
        "Settings panel"
      )
    );
    expect(container.querySelector("p#loading")).toBeFalsy();
  });

  it("Imports the module once, and only after the click", async () => {
    //@ts-expect-error
    const { container } = render(<SettingsPanel />);
    fireEvent.click(container.querySelector("button#open")!);
    await waitFor(() => expect(container.querySelector("p#settings")).toBeTruthy());

    // evaluated exactly once, no matter how many times it is rendered
    expect(await importCount()).toBe(1);

    fireEvent.click(container.querySelector("button#open")!);
    await waitFor(() => expect(container.querySelector("p#settings")).toBeTruthy());
    expect(await importCount()).toBe(1);
  });

  it("Declares the lazy component outside of the render", async () => {
    //@ts-expect-error
    const first = render(<SettingsPanel />);
    fireEvent.click(first.container.querySelector("button#open")!);
    await waitFor(() =>
      expect(first.container.querySelector("p#settings")).toBeTruthy()
    );
    cleanup();

    // a second mount reuses the same lazy component, so nothing is fetched again
    //@ts-expect-error
    const second = render(<SettingsPanel />);
    fireEvent.click(second.container.querySelector("button#open")!);
    await waitFor(() =>
      expect(second.container.querySelector("p#settings")).toBeTruthy()
    );
    expect(await importCount()).toBe(1);
  });
});
