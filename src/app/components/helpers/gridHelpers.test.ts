import { describe, expect, it } from "vitest";

import type { TypeGridState } from "@/app/types";

import {
  cellBordersTent,
  cloneGrid,
  getAdjacentCells,
  getAdjacentEmptyCells,
  getBorderingCells,
  setGridCell,
} from "./gridHelpers";

describe("getAdjacentCells", () => {
  it("returns four neighbors for an interior cell (3×3)", () => {
    const [w, h] = [3, 3];
    expect(getAdjacentCells(1, 1, w, h)).toEqual([
      [2, 1],
      [0, 1],
      [1, 2],
      [1, 0],
    ]);
  });

  it("returns two neighbors on a corner", () => {
    const [w, h] = [3, 3];
    expect(getAdjacentCells(0, 0, w, h)).toEqual([[1, 0], [0, 1]]);
  });

  it("counts four for center vs eight bordering for center", () => {
    const [w, h] = [5, 5];
    expect(getAdjacentCells(2, 2, w, h)).toHaveLength(4);
    expect(getBorderingCells(2, 2, w, h)).toHaveLength(8);
  });
});

describe("getAdjacentEmptyCells", () => {
  const gridFromRows = (...rows: string[][]): TypeGridState =>
    rows.map((row) => [...row] as TypeGridState[number]);

  it("lists only orthogonal blank neighbors", () => {
    const g = gridFromRows(
      ["", "", ""],
      ["", "tree", ""],
      ["tent", "", ""],
    );
    expect(getAdjacentEmptyCells(1, 1, g)).toEqual([
      [2, 1],
      [0, 1],
      [1, 2],
      [1, 0],
    ]);
  });

  it("filters out non-blank orthogonal neighbors (tree, dot, tent)", () => {
    const g = gridFromRows(
      ["tree", "", ""],
      ["", "tree", "."],
      ["", "", "tent"],
    );
    expect(getAdjacentEmptyCells(1, 1, g)).toEqual([
      [2, 1],
      [0, 1],
      [1, 0],
    ]);
  });

  it("returns empty array when tree is surrounded such that no neighbor is blank", () => {
    const g = gridFromRows(
      ["tree", "tree"],
      ["tree", "tree"],
    );
    expect(getAdjacentEmptyCells(0, 0, g)).toEqual([]);
  });
});

describe("cellBordersTent", () => {
  const gridFromRows = (...rows: string[][]): TypeGridState =>
    rows.map((row) => [...row] as TypeGridState[number]);

  it("is true when an eight-neighbor cell is a tent", () => {
    const g = gridFromRows(
      ["", "tent", ""],
      ["", "", ""],
      ["", "", ""],
    );
    expect(cellBordersTent(1, 1, g)).toBe(true);
    expect(cellBordersTent(0, 0, g)).toBe(true);
    expect(cellBordersTent(0, 2, g)).toBe(true);
  });

  it("is false when no neighbor is a tent", () => {
    const g = gridFromRows(
      ["", "", ""],
      ["", "tree", ""],
      ["", "", ""],
    );
    expect(cellBordersTent(0, 0, g)).toBe(false);
    expect(cellBordersTent(2, 2, g)).toBe(false);
  });
});

describe("cloneGrid", () => {
  it("returns a deep copy and does not mutate when the clone is edited", () => {
    const original: TypeGridState = [
      ["", "tree"],
      ["tent", ""],
    ];
    const copy = cloneGrid(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy[0]).not.toBe(original[0]);

    copy[0][0] = "tent";
    expect(original[0][0]).toBe("");
  });
});

describe("setGridCell", () => {
  const gridFromRows = (...rows: string[][]): TypeGridState =>
    rows.map((row) => [...row] as TypeGridState[number]);

  it("returns a new grid with one cell updated", () => {
    const g = gridFromRows(
      ["", ""],
      ["", ""],
    );
    const next = setGridCell(g, 0, 1, "tent");
    expect(next[0][1]).toBe("tent");
    expect(g[0][1]).toBe("");
    expect(next).not.toBe(g);
  });

  it("does not share row references with the input", () => {
    const g = gridFromRows(["", ""]);
    const next = setGridCell(g, 0, 0, "tree");
    expect(next[0]).not.toBe(g[0]);
  });
});
