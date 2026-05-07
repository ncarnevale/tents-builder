"use client";

import { useMemo, useState } from "react";

import type { TypeCell, TypeCoordinates } from "../../types";
import Grid from "../Grid";
import SubmitModal from "../SubmitModal";
import SuccessModal from "../SuccessModal";
import GridToolbar from "../GridToolbar";
import BuildGridStats from "./BuildGridStats";

import {
  calculateTotals,
  cellBordersTent,
  getAdjacentEmptyCells,
  gridWithOnlyTrees,
  isBlank,
} from "../helpers/gridHelpers";

import { Undo2, Redo2 } from "lucide-react";
import { useBuildGridHistory } from "./hooks/useBuildGridHistory";
import { useSubmitPuzzle } from "./hooks/useSubmitPuzzle";
import { usePrint } from "../hooks/usePrint";

type TypeBuildGridProps = {
  width: number;
  height: number;
  onNewPuzzleClick?: () => void;
};

function BuildGrid({
  width,
  height,
  onNewPuzzleClick = () => {},
}: TypeBuildGridProps) {
  const { print, isPrinting } = usePrint();

  const [next, setNext] = useState<"tent" | "tree">("tree");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    grid,
    treeAwaitingTent,
    gridHistory,
    commitEdit,
    undoHistory,
    redoHistory,
    resetHistory,
  } = useBuildGridHistory(width, height);

  const {
    error,
    setError,
    isCalculating,
    nodeCount,
    validatePuzzle,
    submitPuzzle,
  } = useSubmitPuzzle(grid);

  const onSubmit = async () => {
    if (await validatePuzzle()) {
      setIsSubmitModalOpen(true);
    }
  };

  const handleModalSave = async (name: string, isPublic: boolean) => {
    const result = await submitPuzzle(name, isPublic);
    if ("id" in result && result.id) {
      setIsSubmitModalOpen(false);
      setSubmittedId(result.id);
      setIsSuccessModalOpen(true);
    } else {
      setError("error" in result ? result.error : "Something went wrong.");
    }
  };

  const handleModalCancel = () => {
    setIsSubmitModalOpen(false);
    setError("");
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSubmittedId(null);
  };

  const updateGrid = (x: number, y: number, val: TypeCell) => {
    setError("");
    commitEdit(x, y, val);
  };

  const toggleNext = () => {
    setNext(next === "tent" ? "tree" : "tent");
  };

  const undo = () => {
    if (gridHistory.index < 1) return;
    undoHistory();
    setError("");
    toggleNext();
  };

  const redo = () => {
    if (gridHistory.index + 1 >= gridHistory.history.length) return;
    redoHistory();
    setError("");
    toggleNext();
  };

  const clear = () => {
    resetHistory();
    setNext("tree");
    setError("");
  };

  const [colTotals, rowTotals] = useMemo(() => calculateTotals(grid), [grid]);

  const tentCandidateCoords = useMemo((): TypeCoordinates => {
    if (next !== "tent" || treeAwaitingTent === null) return [];
    return getAdjacentEmptyCells(
      treeAwaitingTent[0],
      treeAwaitingTent[1],
      grid,
    ).filter(([tx, ty]) => !cellBordersTent(tx, ty, grid));
  }, [next, treeAwaitingTent, grid]);

  const isGridCellClickable = useMemo(
    () => (x: number, y: number) => {
      if (!isBlank(x, y, grid)) return false;
      if (next === "tree") return true;
      return tentCandidateCoords.some(([tx, ty]) => tx === x && ty === y);
    },
    [grid, next, tentCandidateCoords],
  );

  const toggleCell = (x: number, y: number) => {
    if (!isGridCellClickable(x, y)) return;
    updateGrid(x, y, next);
    toggleNext();
  };

  return (
    <div className="max-w-lg w-full flex flex-col items-center m-auto">
      <GridToolbar gridWidth={width} className="mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-1 gap-2">
            <button
              type="button"
              className="btn-primary text-sm py-1 px-4"
              onClick={() => undo()}
              title="Undo"
              disabled={gridHistory.index <= 0}
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              className="btn-primary text-sm py-1 px-4"
              onClick={() => redo()}
              title="Redo"
              disabled={gridHistory.index + 1 >= gridHistory.history.length}
            >
              <Redo2 size={16} />
            </button>
            <button
              type="button"
              className="btn-primary text-sm py-1 px-4"
              onClick={() => clear()}
              disabled={gridHistory.index <= 0}
            >
              Clear
            </button>
          </div>
          <div className="flex flex-1 gap-4 justify-center">
            <BuildGridStats grid={grid} />
          </div>
          <button
            type="button"
            className="btn-primary flex-1 text-sm py-1 px-4"
            onClick={() => onNewPuzzleClick()}
          >
            New Puzzle
          </button>
        </div>
      </GridToolbar>
      <Grid
        grid={isPrinting ? gridWithOnlyTrees(grid) : grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
        isCellClickable={isGridCellClickable}
        highlightCells={next === "tent" ? tentCandidateCoords : undefined}
        softHighlightCells={
          next === "tent" && treeAwaitingTent ? [treeAwaitingTent] : undefined
        }
      />
      <GridToolbar gridWidth={width}>
        <button
          type="button"
          className="btn-primary w-full mt-4 text-lg py-1 px-4"
          disabled={next === "tent" || gridHistory.index === 0 || !!error}
          onClick={onSubmit}
        >
          {isCalculating
            ? `Calculating... (${nodeCount} nodes explored)`
            : "Submit"}
        </button>
      </GridToolbar>
      {error && <div className="mt-8 text-red-400">{error}</div>}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        link={submittedId ? `/play/${submittedId}` : ""}
        onClose={handleSuccessModalClose}
        onPrint={() => print()}
      />
    </div>
  );
}

export default BuildGrid;
