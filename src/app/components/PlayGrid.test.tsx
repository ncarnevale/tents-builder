// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PlayGrid from "./PlayGrid";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

const cell = (x: number, y: number) =>
  screen.getByLabelText(`row ${x + 1}, column ${y + 1}`);

afterEach(() => {
  cleanup();
});

describe("PlayGrid", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders", () => {
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    expect(cell(0, 0)).toBeInTheDocument();
    expect(cell(0, 0).textContent).toBe("");
  });

  it("cycles a blank cell through tent, dot, and blank on repeated clicks", async () => {
    const user = userEvent.setup();
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    const c = cell(0, 0);
    await user.click(c);
    expect(c.textContent).toBe("⛺");
    await user.click(c);
    expect(c.textContent).toBe("●");
    await user.click(c);
    expect(c.textContent).toBe("");
    await user.click(c);
    expect(c.textContent).toBe("⛺");
  });

  it("undo restores cell after a play edit", async () => {
    const user = userEvent.setup();
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    const c = cell(0, 0);
    await user.click(c);
    expect(c.textContent).toBe("⛺");
    await user.click(screen.getByTitle("Undo"));
    expect(c.textContent).toBe("");
  });

  it("renders a Clear action and triggers print", async () => {
    const user = userEvent.setup();
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Print" }));
    expect(printSpy).toHaveBeenCalledTimes(1);
  });

  it("hides tents and dots while printing", async () => {
    const user = userEvent.setup();
    render(<PlayGrid width={2} height={2} trees={[[0, 0]]} tents={[[0, 1]]} />);

    await user.click(cell(0, 1));
    expect(cell(0, 1).textContent).toBe("⛺");

    act(() => {
      window.dispatchEvent(new Event("beforeprint"));
    });

    expect(cell(0, 0).textContent).toBe("🌳");
    expect(cell(0, 1).textContent).toBe("");

    act(() => {
      window.dispatchEvent(new Event("afterprint"));
    });

    expect(cell(0, 1).textContent).toBe("⛺");
  });
});
