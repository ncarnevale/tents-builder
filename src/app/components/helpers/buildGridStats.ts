import type { TypeGridState } from "@/app/types";

import { isTent, isTree } from "./gridHelpers";

/** Max tents if no two border (including diagonally): non-attacking kings on a full rectangle. */
export function maxTentsForDimensions(height: number, width: number): number {
  return Math.ceil(height / 2) * Math.ceil(width / 2);
}

export function countTrees(grid: TypeGridState): number {
  let n = 0;
  grid.forEach((row, x) => {
    row.forEach((_, y) => {
      if (isTree(x, y, grid)) n += 1;
    });
  });
  return n;
}

export function countTents(grid: TypeGridState): number {
  let n = 0;
  grid.forEach((row, x) => {
    row.forEach((_, y) => {
      if (isTent(x, y, grid)) n += 1;
    });
  });
  return n;
}

export function buildGridDensityPercent(
  tentCount: number,
  height: number,
  width: number,
): number {
  const maxTents = maxTentsForDimensions(height, width);
  if (maxTents === 0) return 0;
  return Math.round((tentCount / maxTents) * 100);
}
