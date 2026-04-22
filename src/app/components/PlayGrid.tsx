"use client";

import { useEffect, useState, useMemo } from "react";
import confetti from "canvas-confetti";

import type { TypeCoordinates, TypeCell, TypeGridState } from "../types";
import Grid from "./Grid";
import GridToolBar from "./GridToolbar";
import { isTent, isTree, isBlank, isDot } from "./helpers/gridHelpers";

type TypeGridProps = {
  width: number;
  height: number;
  trees: TypeCoordinates;
  tents: TypeCoordinates;
};

const fireConfetti = () => {
  const duration = 500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

const emptyGrid = (width: number, height: number): TypeGridState =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => ""));

function PlayGrid({ width, height, trees, tents }: TypeGridProps) {
  const [grid, setGrid] = useState<TypeGridState>(emptyGrid(width, height));

  const updateGrid = (x: number, y: number, val: TypeCell) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid.map((rows) => [...rows])];
      newGrid[x][y] = val;
      return newGrid;
    });
  };

  useEffect(() => {
    setGrid(emptyGrid(width, height));
    trees.forEach(([x, y]) => {
      updateGrid(x, y, "tree");
    });
  }, [width, height, trees]);

  const numberOfTents = grid
    .flatMap((cell) => cell)
    .filter((c) => c === "tent").length;

  const isWin =
    numberOfTents === tents.length &&
    tents.every(([x, y]) => {
      return isTent(x, y, grid);
    });

  useEffect(() => {
    if (isWin) {
      fireConfetti();
    }
  }, [isWin]);

  const [colTotals, rowTotals] = useMemo(() => {
    const colTotals = Array.from({ length: width }, () => 0);
    const rowTotals = Array.from({ length: height }, () => 0);
    tents.forEach(([x, y]) => {
      colTotals[y] += 1;
      rowTotals[x] += 1;
    });
    return [colTotals, rowTotals];
  }, [tents, width, height]);

  const toggleCell = (x: number, y: number) => {
    if (isTree(x, y, grid)) return;
    else if (isBlank(x, y, grid)) updateGrid(x, y, ".");
    else if (isDot(x, y, grid)) updateGrid(x, y, "tent");
    else if (isTent(x, y, grid)) updateGrid(x, y, "");
  };

  return (
    <div className="flex flex-col items-center">
      <GridToolBar />
      <Grid
        height={height}
        width={width}
        grid={grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
      />
      {isWin && (
        <div className="ml-10 mt-12 text-2xl font-bold text-green-500">
          🎉 Nicely done! 🎉
        </div>
      )}
    </div>
  );
}

export default PlayGrid;
