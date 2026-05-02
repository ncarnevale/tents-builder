import { useMemo, useState } from "react";

import type { TypeCell, TypeGridState } from "../../../types";

export type TypeGridSnapshot = {
  grid: TypeGridState;
  treeAwaitingTent: [number, number] | null;
};

export type TypeGridHistory = {
  history: TypeGridSnapshot[];
  index: number;
};

const emptySnapshot = (width: number, height: number): TypeGridSnapshot => ({
  grid: Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "" as TypeCell),
  ),
  treeAwaitingTent: null,
});

export function useBuildGridHistory(width: number, height: number) {
  const [gridHistory, setGridHistory] = useState<TypeGridHistory>(() => ({
    history: [emptySnapshot(width, height)],
    index: 0,
  }));

  const { grid, treeAwaitingTent } = useMemo(
    () => gridHistory.history[gridHistory.index],
    [gridHistory],
  );

  const commitEdit = (x: number, y: number, val: TypeCell) => {
    setGridHistory((prev) => {
      const prevSnap = prev.history[prev.index];
      let nextAwaiting = prevSnap.treeAwaitingTent;
      if (val === "tree") nextAwaiting = [x, y];
      if (val === "tent") nextAwaiting = null;

      const newGrid = prevSnap.grid.map((row) => [...row]);
      newGrid[x][y] = val;

      return {
        history: [
          ...prev.history.slice(0, prev.index + 1),
          { grid: newGrid, treeAwaitingTent: nextAwaiting },
        ],
        index: prev.index + 1,
      };
    });
  };

  const undoHistory = () => {
    setGridHistory((prev) => {
      if (prev.index < 1) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  };

  const redoHistory = () => {
    setGridHistory((prev) => {
      if (prev.index + 1 >= prev.history.length) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  };

  const resetHistory = () => {
    setGridHistory((prev) => ({
      history: [prev.history[0]],
      index: 0,
    }));
  };

  return {
    grid,
    treeAwaitingTent,
    gridHistory,
    commitEdit,
    undoHistory,
    redoHistory,
    resetHistory,
  };
}
