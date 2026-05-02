import { useMemo, useState } from "react";

import type { TypeCell, TypeGridState } from "../../../types";

export type TypeGridHistory = {
  history: TypeGridState[];
  index: number;
};

export function useBuildGridHistory(width: number, height: number) {
  const [gridHistory, setGridHistory] = useState<TypeGridHistory>(() => ({
    history: [
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => ""),
      ),
    ],
    index: 0,
  }));

  const grid = useMemo(
    () => gridHistory.history[gridHistory.index],
    [gridHistory],
  );

  const commitEdit = (x: number, y: number, val: TypeCell) => {
    setGridHistory((prev) => {
      const prevGrid = prev.history[prev.index];
      const newGrid = prevGrid.map((row) => [...row]);
      newGrid[x][y] = val;
      return {
        history: [...prev.history.slice(0, prev.index + 1), newGrid],
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
    gridHistory,
    commitEdit,
    undoHistory,
    redoHistory,
    resetHistory,
  };
}
