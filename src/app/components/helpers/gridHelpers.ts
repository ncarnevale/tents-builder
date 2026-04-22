import { TypeGridState } from "@/app/types";

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
