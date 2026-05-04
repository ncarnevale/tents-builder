import { describe, expect, it } from "vitest";

import type { TypeGridState } from "@/app/types";

import {
  buildGridDensityPercent,
  countTents,
  countTrees,
  maxTentsForDimensions,
} from "./buildGridStats";

const gridFromRows = (...rows: string[][]): TypeGridState =>
  rows.map((row) => [...row] as TypeGridState[number]);

describe("maxTentsForDimensions", () => {
  it.each([
    [1, 1, 1],
    [2, 2, 1],
    [2, 3, 2],
    [3, 3, 4],
    [4, 4, 4],
    [6, 8, 12],
  ] as const)("height %i width %i → %i", (height, width, expected) => {
    expect(maxTentsForDimensions(height, width)).toBe(expected);
  });
});

describe("countTrees and countTents", () => {
  it("counts only tree and tent cells; ignores blank and dot", () => {
    const g = gridFromRows(
      ["tree", "", "."],
      ["", "tent", "tree"],
    );
    expect(countTrees(g)).toBe(2);
    expect(countTents(g)).toBe(1);
  });

  it("returns zero on an empty grid", () => {
    const g = gridFromRows(["", ""], ["", ""]);
    expect(countTrees(g)).toBe(0);
    expect(countTents(g)).toBe(0);
  });
});

describe("buildGridDensityPercent", () => {
  it("returns 0 when there are no tents", () => {
    expect(buildGridDensityPercent(0, 3, 3)).toBe(0);
  });

  it("returns 100 at full non-attacking-king capacity", () => {
    expect(buildGridDensityPercent(4, 3, 3)).toBe(100);
  });

  it("returns 25 for one tent on a 3×3 board (max 4)", () => {
    expect(buildGridDensityPercent(1, 3, 3)).toBe(25);
  });

  it("rounds to nearest integer", () => {
    // 2 / 4 * 100 = 50
    expect(buildGridDensityPercent(2, 3, 3)).toBe(50);
    // 1 / 12 * 100 ≈ 8.33 → 8
    expect(buildGridDensityPercent(1, 6, 8)).toBe(8);
    // 2 / 12 * 100 ≈ 16.67 → 17
    expect(buildGridDensityPercent(2, 6, 8)).toBe(17);
  });

  it("returns 0 when max capacity is zero (defensive)", () => {
    expect(buildGridDensityPercent(1, 0, 3)).toBe(0);
  });
});
