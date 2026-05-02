import { TypeCoordinates, TypeGridState } from "@/app/types";

export function isTree(x: number, y: number, g: TypeGridState) {
  return g[x][y] === "tree";
}
export function isTent(x: number, y: number, g: TypeGridState) {
  return g[x][y] === "tent";
}
export function isBlank(x: number, y: number, g: TypeGridState) {
  return g[x][y] === "";
}
export function isDot(x: number, y: number, g: TypeGridState) {
  return g[x][y] === ".";
}

export function getGridDimensions(
  grid: TypeGridState,
): [width: number, height: number] {
  return [grid[0].length, grid.length];
}

function isInGrid(
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  return x >= 0 && y >= 0 && x < height && y < width;
}

/** Cells that border this one orthogonally (up, down, left, right). “Adjacent”. */
export function getAdjacentCells(
  x: number,
  y: number,
  width: number,
  height: number,
): TypeCoordinates {
  return (
    [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ] as TypeCoordinates
  ).filter(([cellX, cellY]) => isInGrid(cellX, cellY, width, height));
}

/** Cells bordering this one including diagonals (eight neighbors). “Bordering”. */
export function getBorderingCells(
  x: number,
  y: number,
  width: number,
  height: number,
): TypeCoordinates {
  return (
    [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x - 1, y - 1],
    ] as TypeCoordinates
  ).filter(([cellX, cellY]) => isInGrid(cellX, cellY, width, height));
}

/** Adjacent cells that are blank (`""`). */
export function getAdjacentEmptyCells(
  x: number,
  y: number,
  g: TypeGridState,
): TypeCoordinates {
  const [width, height] = getGridDimensions(g);
  return getAdjacentCells(x, y, width, height).filter(([cellX, cellY]) =>
    isBlank(cellX, cellY, g),
  );
}

export function calculateTotals(
  g: TypeGridState,
): [colTotals: number[], rowTotals: number[]] {
  const colTotals = Array.from({ length: g[0]?.length }, () => 0);
  const rowTotals = Array.from({ length: g.length }, () => 0);
  g.forEach((rows, x) => {
    rows.forEach((cell, y) => {
      if (isTent(x, y, g)) {
        colTotals[y] += 1;
        rowTotals[x] += 1;
      }
    });
  });
  return [colTotals, rowTotals];
}
