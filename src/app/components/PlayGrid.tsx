"use client";

import { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Redo2, Undo2 } from "lucide-react";

import type { TypeCoordinates, TypeGridState } from "../types";
import Grid from "./Grid";
import GridToolBar from "./GridToolbar";
import { useGridHistory } from "./hooks/useGridHistory";
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

function initGrid(
  width: number,
  height: number,
  trees: TypeCoordinates,
): TypeGridState {
  const grid = emptyGrid(width, height);
  trees.forEach(([x, y]) => {
    grid[x][y] = "tree";
  });
  return grid;
}

function PlayGrid({ width, height, trees, tents }: TypeGridProps) {
  const initialGrid = useMemo(
    () => initGrid(width, height, trees),
    [width, height, trees],
  );

  const {
    grid,
    gridHistory,
    commitEdit,
    undoHistory,
    redoHistory,
    resetHistory,
  } = useGridHistory(initialGrid);

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
    else if (isBlank(x, y, grid)) commitEdit(x, y, "tent");
    else if (isTent(x, y, grid)) commitEdit(x, y, ".");
    else if (isDot(x, y, grid)) commitEdit(x, y, "");
  };

  return (
    <div className="max-w-xl flex flex-col items-center m-auto">
      <GridToolBar gridWidth={width}>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary text-sm py-2 px-4"
              onClick={() => undoHistory()}
              title="Undo"
              disabled={gridHistory.index <= 0}
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              className="btn-primary text-sm py-2 px-4"
              onClick={() => redoHistory()}
              title="Redo"
              disabled={gridHistory.index + 1 >= gridHistory.history.length}
            >
              <Redo2 size={16} />
            </button>
          </div>
          <button
            type="button"
            className="btn-primary text-sm py-2 px-4"
            onClick={() => resetHistory()}
            disabled={gridHistory.index <= 0}
          >
            Restart
          </button>
        </div>
      </GridToolBar>
      <Grid
        grid={grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
        isCellClickable={(_, __, cell) => cell !== "tree"}
      />
      {isWin && (
        <div className="ml-10 mt-12 text-2xl font-bold text-tertiary saturate-250">
          🎉 Nicely done! 🎉
        </div>
      )}
    </div>
  );
}

export default PlayGrid;
