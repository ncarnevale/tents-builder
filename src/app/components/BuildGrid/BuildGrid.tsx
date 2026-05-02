"use client";

import { useMemo, useState } from "react";

import type { TypeCell, TypeCoordinates } from "../../types";
import Grid from "../Grid";
import SubmitModal from "../SubmitModal";
import SuccessModal from "../SuccessModal";
import GridToolbar from "../GridToolbar";

import {
  calculateTotals,
  getAdjacentEmptyCells,
  isBlank,
} from "../helpers/gridHelpers";

import { Undo2, Redo2 } from "lucide-react";
import { useBuildGridHistory } from "./hooks/useBuildGridHistory";
import { useSubmitPuzzle } from "./hooks/useSubmitPuzzle";

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
    );
  }, [next, treeAwaitingTent, grid]);

  const isGridCellClickable = useMemo(
    () => (x: number, y: number) => {
      if (!isBlank(x, y, grid)) return false;
      if (next === "tree") return true;
      return tentCandidateCoords.some(([tx, ty]) => tx === x && ty === y);
    },
    [grid, next, tentCandidateCoords, treeAwaitingTent],
  );

  const toggleCell = (x: number, y: number) => {
    if (!isGridCellClickable(x, y)) return;
    updateGrid(x, y, next);
    toggleNext();
  };

  return (
    <div className="max-w-xl flex flex-col items-center m-auto">
      <GridToolbar>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => undo()}
              title="Undo"
              disabled={gridHistory.index <= 0}
            >
              <Undo2 size={16} />
            </button>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => redo()}
              title="Redo"
              disabled={gridHistory.index + 1 >= gridHistory.history.length}
            >
              <Redo2 size={16} />
            </button>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => clear()}
              disabled={gridHistory.index <= 0}
            >
              Restart
            </button>
          </div>
          <div>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => onNewPuzzleClick()}
            >
              New Puzzle
            </button>
          </div>
        </div>
      </GridToolbar>
      <Grid
        grid={grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
        isCellClickable={isGridCellClickable}
        highlightCells={next === "tent" ? tentCandidateCoords : undefined}
      />
      <GridToolbar>
        <button
          className="w-full cursor-pointer mt-6 text-lg font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 my-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
          disabled={next === "tent" || gridHistory.index === 0 || !!error}
          onClick={onSubmit}
        >
          {isCalculating
            ? `Calculating... (${nodeCount} nodes explored)`
            : "Submit"}
        </button>
      </GridToolbar>
      {error && <div className="mt-8 text-red-200">{error}</div>}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        link={`/play/${submittedId}`}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default BuildGrid;
