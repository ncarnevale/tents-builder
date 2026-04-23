"use client";

import { useState, useMemo } from "react";

import type { TypeCell, TypeCoordinates, TypeGridState } from "../types";
import Grid from "./Grid";
import SubmitModal from "./SubmitModal";
import SuccessModal from "./SuccessModal";
import postGrid from "../services/postGrid";
import GridToolBar from "./GridToolbar";

import {
  isTent,
  isTree,
  isBlank,
  calculateTotals,
} from "./helpers/gridHelpers";

import { Undo2, Redo2 } from "lucide-react";
import validateGrid from "./helpers/validateGrid";

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
  const [history, setHistory] = useState<TypeGridState[]>([
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ""),
    ),
  ]);

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [error, setError] = useState("");

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [nodeCount, setNodeCount] = useState<number>(0);

  const grid = useMemo(() => history[historyIndex], [history, historyIndex]);

  const updateGrid = (x: number, y: number, val: TypeCell) => {
    setError("");
    setHistory((prevHistory) => {
      const prevGrid = prevHistory[historyIndex];
      const newGrid = [...prevGrid.map((rows) => [...rows])];
      newGrid[x][y] = val;
      return [...prevHistory.slice(0, historyIndex + 1), newGrid];
    });
    setHistoryIndex((i) => i + 1);
  };

  const toggleNext = () => {
    setNext(next === "tent" ? "tree" : "tent");
  };

  const undo = () => {
    if (historyIndex < 1) return;
    setHistoryIndex((i) => i - 1);
    setError("");
    toggleNext();
  };

  const redo = () => {
    if (historyIndex + 1 >= history.length) return;
    setHistoryIndex((i) => i + 1);
    setError("");
    toggleNext();
  };

  const clear = () => {
    setHistory([history[0]]);
    setHistoryIndex(0);
    setNext("tree");
    setError("");
  };

  const [colTotals, rowTotals] = useMemo(() => calculateTotals(grid), [grid]);

  const toggleCell = (x: number, y: number) => {
    if (!isBlank(x, y, grid)) return;
    else updateGrid(x, y, next);
    toggleNext();
  };

  const submitGrid = async (name: string, isPublic: boolean) => {
    const treeCoordinates: TypeCoordinates = [];
    const tentCoordinates: TypeCoordinates = [];
    grid.forEach((rows, x) => {
      rows.forEach((val, y) => {
        if (isTree(x, y, grid)) treeCoordinates.push([x, y]);
        else if (isTent(x, y, grid)) tentCoordinates.push([x, y]);
      });
    });

    const { id } = await postGrid({
      width,
      height,
      treeCoordinates,
      tentCoordinates,
      author: name,
      isPublic,
    });

    if (id) {
      setSubmittedId(id);
      setIsSuccessModalOpen(true);
    }
  };

  const onSubmit = async () => {
    setIsCalculating(true);
    const error = await validateGrid(grid, (count) => setNodeCount(count));
    setIsCalculating(false);
    if (error) {
      setError(error);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleModalSave = (name: string, isPublic: boolean) => {
    setIsSubmitModalOpen(false);
    submitGrid(name, isPublic);
  };

  const handleModalCancel = () => {
    setIsSubmitModalOpen(false);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSubmittedId(null);
  };

  return (
    <div className="max-w-xl flex flex-col items-center m-auto">
      <GridToolBar>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => undo()}
              title="Undo"
              disabled={historyIndex <= 0}
            >
              <Undo2 size={16} />
            </button>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => redo()}
              title="Redo"
              disabled={historyIndex + 1 >= history.length}
            >
              <Redo2 size={16} />
            </button>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => clear()}
              disabled={historyIndex <= 0}
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
      </GridToolBar>
      <Grid
        grid={grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
        nonClickableCellTypes={["tree", "tent"]}
      />
      <GridToolBar>
        <button
          className="w-full cursor-pointer mt-6 text-lg font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 my-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
          disabled={next === "tent" || historyIndex === 0 || !!error}
          onClick={onSubmit}
        >
          {isCalculating
            ? `Calculating... (${nodeCount} nodes explored)`
            : "Submit"}
        </button>
      </GridToolBar>
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
