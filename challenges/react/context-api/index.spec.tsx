import { describe, it, expect } from "vitest";
//@ts-expect-error
import { ThemeContext, ThemeProvider, useTheme } from "./src/context/theme-context";
//@ts-expect-error
import ThemeToggle from "./src/components/theme-toggle";
//@ts-expect-error
import Toolbar from "./src/components/toolbar";
import { render, fireEvent, renderHook } from "@testing-library/react";

describe("Tests for Context challenge", () => {
  describe("Tests for ThemeContext", () => {
    it("Exports a context", () => {
      expect(ThemeContext).toBeTruthy();
      expect(ThemeContext.Provider).toBeTruthy();
    });

    it("Has a sensible default value", () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe("light");
      expect(typeof result.current.toggleTheme).toBe("function");
    });

    it("Provides the theme and a toggle", () => {
      const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
      expect(result.current.theme).toBe("light");
      expect(typeof result.current.toggleTheme).toBe("function");
    });
  });

  describe("Tests for ThemeToggle", () => {
    it("Renders the button with the label for the current theme", () => {
      const { container } = render(
        //@ts-expect-error
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );
      expect(container.querySelector("button#toggle")?.textContent).toBe(
        "Switch to dark"
      );
    });

    it("Toggles the theme on click", () => {
      const { container } = render(
        //@ts-expect-error
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );
      fireEvent.click(container.querySelector("button#toggle")!);
      expect(container.querySelector("button#toggle")?.textContent).toBe(
        "Switch to light"
      );
      fireEvent.click(container.querySelector("button#toggle")!);
      expect(container.querySelector("button#toggle")?.textContent).toBe(
        "Switch to dark"
      );
    });
  });

  describe("Tests for Toolbar", () => {
    it("Reads the theme without receiving any props", () => {
      const { container } = render(
        //@ts-expect-error
        <ThemeProvider>
          <Toolbar />
        </ThemeProvider>
      );
      expect(container.querySelector("span#theme")?.textContent).toBe("light");
      expect(container.querySelector("button#toggle")).toBeTruthy();
    });

    it("Updates every consumer when the theme changes", () => {
      const { container } = render(
        //@ts-expect-error
        <ThemeProvider>
          <Toolbar />
        </ThemeProvider>
      );
      fireEvent.click(container.querySelector("button#toggle")!);
      expect(container.querySelector("span#theme")?.textContent).toBe("dark");
      expect(container.querySelector("button#toggle")?.textContent).toBe(
        "Switch to light"
      );
    });
  });
});
