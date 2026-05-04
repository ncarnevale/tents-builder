import { useMemo, useState } from "react";

import type { TypeCell, TypeGridState } from "../../../types";

import { setGridCell } from "../../helpers/gridHelpers";
import {
  pushSnapshot,
  redoSnapshot,
  resetSnapshotHistory,
  type TypeSnapshotHistory,
  undoSnapshot,
} from "../../hooks/gridSnapshotHistory";

export type TypeBuildGridSnapshot = {
  grid: TypeGridState;
  treeAwaitingTent: [number, number] | null;
};

export type TypeBuildGridHistory = TypeSnapshotHistory<TypeBuildGridSnapshot>;

const emptySnapshot = (width: number, height: number): TypeBuildGridSnapshot => ({
  grid: Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "" as TypeCell),
  ),
  treeAwaitingTent: null,
});

export function useBuildGridHistory(width: number, height: number) {
  const [gridHistory, setGridHistory] = useState<TypeBuildGridHistory>(() => ({
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

      const nextGrid = setGridCell(prevSnap.grid, x, y, val);
      return pushSnapshot(prev, {
        grid: nextGrid,
        treeAwaitingTent: nextAwaiting,
      });
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
    treeAwaitingTent,
    gridHistory,
    commitEdit,
    undoHistory,
    redoHistory,
    resetHistory,
  };
}
