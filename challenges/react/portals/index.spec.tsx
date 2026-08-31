import { describe, it, expect, vi, afterEach } from "vitest";
//@ts-expect-error
import Modal from "./src/components/modal";
import { render, fireEvent, cleanup } from "@testing-library/react";

describe("Tests for Portals challenge", () => {
  // a portal renders into document.body, so it has to be unmounted between tests
  afterEach(cleanup);

  it("Renders nothing when it is closed", () => {
    //@ts-expect-error
    const { container } = render(<Modal open={false} onClose={() => {}}>Hello</Modal>);
    expect(container.innerHTML).toBe("");
    expect(document.body.querySelector("#modal")).toBeFalsy();
  });

  it("Renders the overlay and the modal when it is open", () => {
    //@ts-expect-error
    render(<Modal open onClose={() => {}}>Hello</Modal>);
    expect(document.body.querySelector("div#modal-overlay")).toBeTruthy();
    expect(document.body.querySelector("div#modal")).toBeTruthy();
    expect(document.body.querySelector("button#close")).toBeTruthy();
  });

  it("Renders its children", () => {
    //@ts-expect-error
    render(<Modal open onClose={() => {}}><p id="content">Hello</p></Modal>);
    expect(document.body.querySelector("#modal #content")?.textContent).toBe("Hello");
  });

  it("Renders outside its parent's DOM node", () => {
    //@ts-expect-error
    const { container } = render(<Modal open onClose={() => {}}>Hello</Modal>);
    expect(container.querySelector("#modal")).toBeFalsy();
    expect(document.body.querySelector("#modal")).toBeTruthy();
  });

  it("Calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    //@ts-expect-error
    render(<Modal open onClose={onClose}>Hello</Modal>);
    fireEvent.click(document.body.querySelector("button#close")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Calls onClose when the overlay is clicked", () => {
    const onClose = vi.fn();
    //@ts-expect-error
    render(<Modal open onClose={onClose}>Hello</Modal>);
    fireEvent.click(document.body.querySelector("div#modal-overlay")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Does not call onClose when the modal itself is clicked", () => {
    const onClose = vi.fn();
    //@ts-expect-error
    render(<Modal open onClose={onClose}><p id="content">Hello</p></Modal>);
    fireEvent.click(document.body.querySelector("div#modal")!);
    fireEvent.click(document.body.querySelector("#content")!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("Cleans up the DOM when it closes", () => {
    //@ts-expect-error
    const { rerender } = render(<Modal open onClose={() => {}}>Hello</Modal>);
    expect(document.body.querySelector("#modal")).toBeTruthy();
    //@ts-expect-error
    rerender(<Modal open={false} onClose={() => {}}>Hello</Modal>);
    expect(document.body.querySelector("#modal")).toBeFalsy();
  });
});
