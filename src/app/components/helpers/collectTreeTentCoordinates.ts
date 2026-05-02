import type { TypeCoordinates, TypeGridState } from "@/app/types";

import { isTent, isTree } from "./gridHelpers";

export function collectTreeTentCoordinates(grid: TypeGridState): {
  treeCoordinates: TypeCoordinates;
  tentCoordinates: TypeCoordinates;
} {
  const treeCoordinates: TypeCoordinates = [];
  const tentCoordinates: TypeCoordinates = [];
  grid.forEach((row, x) => {
    row.forEach((_val, y) => {
      if (isTree(x, y, grid)) treeCoordinates.push([x, y]);
      else if (isTent(x, y, grid)) tentCoordinates.push([x, y]);
    });
  });
  return { treeCoordinates, tentCoordinates };
}
