// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

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
  it("renders", () => {
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    expect(cell(0, 0)).toBeInTheDocument();
    expect(cell(0, 0).textContent).toBe("");
  });

  it("cycles a blank cell through dot, tent, and blank on repeated clicks", async () => {
    const user = userEvent.setup();
    render(<PlayGrid width={2} height={2} trees={[]} tents={[[0, 1]]} />);

    const c = cell(0, 0);
    await user.click(c);
    expect(c.textContent).toBe("●");
    await user.click(c);
    expect(c.textContent).toBe("⛺");
    await user.click(c);
    expect(c.textContent).toBe("");
    await user.click(c);
    expect(c.textContent).toBe("●");
  });
});
