// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import BuildGrid from "./BuildGrid";

vi.mock("../../services/postGrid", () => ({
  default: vi.fn().mockResolvedValue({ error: "mock" }),
}));

vi.mock("../helpers/validateGrid", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

const cell = (x: number, y: number) =>
  screen.getByLabelText(`row ${x + 1}, column ${y + 1}`);

type TypeEmojiCell = "🌳" | "⛺" | "●" | "";

// Expect the given visual grid to match the actual grid
function expectVisualPlayGrid(rows: TypeEmojiCell[][]): void {
  rows.forEach((row, x) => {
    row.forEach((expected, y) => {
      expect(cell(x, y).textContent).toBe(expected);
    });
  });
}

afterEach(() => {
  cleanup();
});

describe("BuildGrid", () => {
  it("renders the play grid cells", () => {
    render(<BuildGrid width={2} height={2} />);

    expect(cell(0, 0)).toBeInTheDocument();
    expect(cell(0, 1)).toBeInTheDocument();
    expect(cell(1, 0)).toBeInTheDocument();
    expect(cell(1, 1)).toBeInTheDocument();
    expectVisualPlayGrid([
      ["", ""],
      ["", ""],
    ]);
  });

  it("places a tree on the first click on a blank cell", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={2} height={2} />);

    await user.click(cell(0, 0));

    expectVisualPlayGrid([
      ["🌳", ""],
      ["", ""],
    ]);
  });

  it("reverts to an earlier grid after several clicks and several undos", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(0, 0));
    await user.click(cell(1, 0));
    await user.click(cell(2, 2));
    expectVisualPlayGrid([
      ["🌳", "", ""],
      ["⛺", "", ""],
      ["", "", "🌳"],
    ]);

    await user.click(screen.getByTitle("Undo"));
    await user.click(screen.getByTitle("Undo"));

    expectVisualPlayGrid([
      ["🌳", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });

  it("returns to the post-click state after undos and matching redos", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(0, 0));
    await user.click(cell(1, 0));
    await user.click(cell(2, 2));
    expectVisualPlayGrid([
      ["🌳", "", ""],
      ["⛺", "", ""],
      ["", "", "🌳"],
    ]);

    await user.click(screen.getByTitle("Undo"));
    await user.click(screen.getByTitle("Undo"));
    expectVisualPlayGrid([
      ["🌳", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);

    await user.click(screen.getByTitle("Redo"));
    await user.click(screen.getByTitle("Redo"));
    expectVisualPlayGrid([
      ["🌳", "", ""],
      ["⛺", "", ""],
      ["", "", "🌳"],
    ]);
  });

  it("after placing a tree, highlights orthogonal tent candidates and mutes non-candidate blanks", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(1, 1));

    expectVisualPlayGrid([
      ["", "", ""],
      ["", "🌳", ""],
      ["", "", ""],
    ]);

    expect(cell(0, 0)).toHaveClass("cursor-not-allowed");
    expect(cell(0, 0)).toHaveClass("opacity-[0.58]");
    expect(cell(1, 1)).toHaveClass("bg-emerald-500/10");
    expect(cell(1, 0)).toHaveClass("bg-emerald-500/22", "cursor-pointer");
    expect(cell(1, 0)).not.toHaveClass("opacity-[0.58]");
  });

  it("ignores clicks on blanks that cannot receive the tent this turn", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(1, 1));
    await user.click(cell(0, 0));

    expectVisualPlayGrid([
      ["", "", ""],
      ["", "🌳", ""],
      ["", "", ""],
    ]);
  });

  it("does not place a tree on a blank that borders an existing tent", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(0, 1));
    await user.click(cell(0, 0));
    await user.click(cell(2, 1));

    expectVisualPlayGrid([
      ["⛺", "🌳", ""],
      ["", "", ""],
      ["", "🌳", ""],
    ]);

    await user.click(cell(1, 1));

    expectVisualPlayGrid([
      ["⛺", "🌳", ""],
      ["", "", ""],
      ["", "🌳", ""],
    ]);
  });

  it("does not place a tent on a candidate that borders another tent", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(0, 1));
    await user.click(cell(0, 0));
    await user.click(cell(2, 1));

    await user.click(cell(1, 1));

    expectVisualPlayGrid([
      ["⛺", "🌳", ""],
      ["", "", ""],
      ["", "🌳", ""],
    ]);

    await user.click(cell(2, 0));

    expectVisualPlayGrid([
      ["⛺", "🌳", ""],
      ["", "", ""],
      ["⛺", "🌳", ""],
    ]);
  });

  it("removes tent placement hints after undo and restores them on redo", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={3} height={3} />);

    await user.click(cell(1, 1));

    expect(cell(1, 0)).toHaveClass("bg-emerald-500/22");
    expect(cell(1, 1)).toHaveClass("bg-emerald-500/10");

    await user.click(screen.getByTitle("Undo"));
    expect(cell(1, 0)).not.toHaveClass("bg-emerald-500/22");
    expect(cell(1, 1)).not.toHaveClass("bg-emerald-500/10");
    expect(cell(0, 0)).not.toHaveClass("opacity-[0.58]");

    await user.click(screen.getByTitle("Redo"));
    expect(cell(1, 0)).toHaveClass("bg-emerald-500/22");
    expect(cell(1, 1)).toHaveClass("bg-emerald-500/10");
    expect(cell(0, 0)).toHaveClass("opacity-[0.58]");
  });

  it("on a lone cell grid, placing a tree highlights the tree while awaiting a tent", async () => {
    const user = userEvent.setup();
    render(<BuildGrid width={1} height={1} />);

    await user.click(cell(0, 0));

    expectVisualPlayGrid([["🌳"]]);
    expect(cell(0, 0)).toHaveClass("bg-emerald-500/10");
  });
});
