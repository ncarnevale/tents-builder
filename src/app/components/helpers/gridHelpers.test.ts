import { describe, expect, it } from "vitest";

import type { TypeGridState } from "@/app/types";

import {
  getAdjacentCells,
  getAdjacentEmptyCells,
  getBorderingCells,
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
