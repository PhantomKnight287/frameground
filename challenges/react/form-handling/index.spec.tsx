import { it, describe, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

//@ts-expect-error
import CreateTodo from "./src/components/create-todo";
//@ts-expect-error
import CreateUser from "./src/components/create-user";

describe("Tests for CreateTodo form", () => {
  const onSubmit = vi.fn();
  //@ts-expect-error
  const rendered = render(<CreateTodo onSubmit={onSubmit} />);
  const nameInput = rendered.getByTestId("name");
  const descriptionInput = rendered.getByTestId("description");
  const submitButton = rendered.getByTestId("submit_button");
  const user = userEvent.setup();

  it("Must have a user input", () => {
    expect(nameInput).toBeTruthy();
  });
  it("Value of name must change", async () => {
    await user.type(nameInput, "Gurpal");
    //@ts-expect-error
    expect(nameInput.value).toBe("Gurpal");
  });

  it("Value of description must change", async () => {
    await user.type(descriptionInput, "Owner of FrameGround");
    //@ts-expect-error
    expect(descriptionInput.value).toBe("Owner of FrameGround");
  });

  it("Form must submit", async () => {
    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

describe("Tests for CreateUser form", () => {
  const onSubmit = vi.fn();
  //@ts-expect-error
  const rendered = render(<CreateUser onSubmit={onSubmit} />);
  const nameInput = rendered.getByTestId("name_input");
  const roleSelect = rendered.getByTestId("role_select");
  const submitButton = rendered.getByTestId("submit");
  const user = userEvent.setup();

  it("Must have a user input", () => {
    expect(nameInput).toBeTruthy();
  });
  it("Value of name must change", async () => {
    await user.type(nameInput, "Gurpal");
    //@ts-expect-error
    expect(nameInput.value).toBe("Gurpal");
  });

  it("Default value of role must be 'user'", async () => {
    //@ts-expect-error
    expect(roleSelect.value).toBe("user");
  });

  it("Form must submit", async () => {
    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
