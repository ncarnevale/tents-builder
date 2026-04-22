import { TypeCoordinates, TypeGrid, TypeGridState } from "@/app/types";
import { calculateTotals, isBlank, isTent, isTree } from "./gridHelpers";

const isInGrid = (
  x: number,
  y: number,
  width: number,
  height: number,
): boolean => x >= 0 && y >= 0 && x < height && y < width;

const getGridDimensions = (
  grid: TypeGridState,
): [width: number, height: number] => [grid[0].length, grid.length];

const getBorderingCells = (
  x: number,
  y: number,
  width: number,
  height: number,
): TypeCoordinates =>
  (
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

const getAdjacentCells = (
  x: number,
  y: number,
  width: number,
  height: number,
): TypeCoordinates =>
  (
    [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ] as TypeCoordinates
  ).filter(([cellX, cellY]) => isInGrid(cellX, cellY, width, height));

const getAdjacentEmptyCells = (
  x: number,
  y: number,
  g: TypeGridState,
): TypeCoordinates => {
  const [width, height] = getGridDimensions(g);
  return getAdjacentCells(x, y, width, height).filter(([cellX, cellY]) =>
    isBlank(cellX, cellY, g),
  );
};

const hasBorderingTents = (grid: TypeGridState) => {
  const [width, height] = getGridDimensions(grid);

  for (const [x, rows] of grid.entries()) {
    for (const [y] of rows.entries()) {
      if (isTent(x, y, grid)) {
        for (const [bx, by] of getBorderingCells(x, y, width, height)) {
          if (isTent(bx, by, grid)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const sleep = () => new Promise((r) => setTimeout(r, 0));

const checkForSolutions = async (
  grid: TypeGridState,
  onSetNodeCount?: (n: number) => void,
) => {
  const [width, height] = getGridDimensions(grid);
  const [colTotals, rowTotals] = calculateTotals(grid);

  const gridWithTrees = (): TypeGridState =>
    Array.from({ length: height }, (_, x) =>
      Array.from({ length: width }, (_, y) =>
        isTree(x, y, grid) ? "tree" : "",
      ),
    );

  const trees: TypeCoordinates = [];
  grid.forEach((rows, x) => {
    rows.forEach((val, y) => {
      if (isTree(x, y, grid)) trees.push([x, y]);
    });
  });
  trees.sort(
    (a, b) =>
      getAdjacentEmptyCells(a[0], a[1], grid).length -
      getAdjacentEmptyCells(b[0], b[1], grid).length,
  );

  const isBorderingPlacedTent = (
    x: number,
    y: number,
    grid: TypeGridState,
  ): boolean =>
    getBorderingCells(x, y, width, height).some(([cellX, cellY]) =>
      isTent(cellX, cellY, grid),
    );

  const areInvalidTrees = (trees: TypeCoordinates, grid: TypeGridState) => {
    return trees.some(([tx, ty]) => {
      getAdjacentEmptyCells(tx, ty, grid).some(
        ([cx, cy]) => !isBorderingPlacedTent(cx, cy, grid),
      );
    });
  };

  const isOverTotal = (
    x: number,
    y: number,
    solveRowTotals: number[],
    solveColTotals: number[],
  ): boolean => {
    return (
      solveRowTotals[x] + 1 > rowTotals[x] ||
      solveColTotals[y] + 1 > colTotals[y]
    );
  };

  const solveRowTotals: number[] = new Array(height).fill(0);
  const solveColTotals: number[] = new Array(width).fill(0);

  let solutions: string[] = [];
  let steps = 0;

  const solveNextTree = async (
    treeIndex: number,
    solveGrid: TypeGridState,
  ): Promise<void> => {
    if (steps > 1000000) return;
    if (solutions.length > 1) return;

    steps++;
    if (steps % 100 === 0) {
      await sleep(); // yield to UI
      onSetNodeCount?.(steps);
    }

    if (treeIndex === trees.length) {
      const totalsMatch =
        rowTotals.every((count, i) => count === solveRowTotals[i]) &&
        colTotals.every((count, i) => count === solveColTotals[i]);
      if (totalsMatch && !solutions.includes(JSON.stringify(solveGrid))) {
        solutions.push(JSON.stringify(solveGrid));
      }
      return;
    }

    const [tx, ty] = trees[treeIndex];
    const candidates = getAdjacentEmptyCells(tx, ty, solveGrid);

    for (const [cx, cy] of candidates) {
      if (
        !isBorderingPlacedTent(cx, cy, solveGrid) &&
        !isOverTotal(cx, cy, solveRowTotals, solveColTotals)
      ) {
        solveGrid[cx][cy] = "tent";
        solveRowTotals[cx]++;
        solveColTotals[cy]++;

        if (!areInvalidTrees(trees, solveGrid)) {
          await solveNextTree(treeIndex + 1, solveGrid);
        }

        solveRowTotals[cx]--;
        solveColTotals[cy]--;
        solveGrid[cx][cy] = "";

        if (solutions.length > 1) return;
      }
    }
  };

  await solveNextTree(0, gridWithTrees());

  onSetNodeCount?.(0);

  return solutions;
};

// Returns error string if error, otherwise undefined
const validateGrid = async (
  grid: TypeGridState,
  onSetNodeCount?: (n: number) => void,
): Promise<string | undefined> => {
  if (hasBorderingTents(grid)) {
    return "Error: some tents are bordering each other!";
  }

  const solutions = await checkForSolutions(grid, onSetNodeCount);

  if (solutions.length === 0)
    return "Error: no valid solution exists for this puzzle!";
  if (solutions.length > 1)
    return "Error: more than one valid solution exists — the puzzle is ambiguous!";
};

export default validateGrid;
