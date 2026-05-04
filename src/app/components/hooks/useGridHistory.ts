import { useEffect, useMemo, useState } from "react";

import type { TypeCell, TypeGridState } from "@/app/types";

import { cloneGrid, setGridCell } from "../helpers/gridHelpers";
import {
  pushSnapshot,
  redoSnapshot,
  resetSnapshotHistory,
  type TypeSnapshotHistory,
  undoSnapshot,
} from "./gridSnapshotHistory";

export type TypeGridHistoryState = TypeSnapshotHistory<TypeGridState>;

/** Pass `initialGrid` from `useMemo(..., [width, height, trees])` so resets track puzzle changes. */
export function useGridHistory(initialGrid: TypeGridState) {
  const [gridHistory, setGridHistory] = useState<TypeGridHistoryState>(() => ({
    history: [cloneGrid(initialGrid)],
    index: 0,
  }));

  useEffect(() => {
    setGridHistory({
      history: [cloneGrid(initialGrid)],
      index: 0,
    });
  }, [initialGrid]);

  const grid = useMemo(
    () => gridHistory.history[gridHistory.index],
    [gridHistory],
  );

  const commitEdit = (x: number, y: number, val: TypeCell) => {
    setGridHistory((prev) => {
      const snap = prev.history[prev.index];
      const nextGrid = setGridCell(snap, x, y, val);
      return pushSnapshot(prev, nextGrid);
    });
  };

  const undoHistory = () => {
    setGridHistory((prev) => undoSnapshot(prev));
  };

  const redoHistory = () => {
    setGridHistory((prev) => redoSnapshot(prev));
  };

  const resetHistory = () => {
    setGridHistory((prev) => resetSnapshotHistory(prev));
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
