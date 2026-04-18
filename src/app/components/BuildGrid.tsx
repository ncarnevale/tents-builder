"use client";

import { useState, useMemo } from "react";

import type { TypeCell, TypeCoordinates } from "../types";
import Grid from "./Grid";
import SubmitModal from "./SubmitModal";
import SuccessModal from "./SuccessModal";
import postGrid from "../services/postGrid";
import GridToolBar from "./GridToolbar";

import { Undo2, Redo2 } from "lucide-react";

type TypeGridState = TypeCell[][];

type TypeBuildGridProps = {
  width: number;
  height: number;
};

function BuildGrid({ width, height }: TypeBuildGridProps) {
  const [next, setNext] = useState<"tent" | "tree">("tree");
  const [history, setHistory] = useState<TypeGridState[]>([
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ""),
    ),
  ]);

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

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

  const isTree = (x: number, y: number, g: TypeGridState = grid) =>
    g[x][y] === "tree";
  const isTent = (x: number, y: number, g: TypeGridState = grid) =>
    g[x][y] === "tent";
  const isBlank = (x: number, y: number, g: TypeGridState = grid) =>
    g[x][y] === "";
  const isDot = (x: number, y: number, g: TypeGridState = grid) =>
    g[x][y] === ".";

  const calculateTotals = (g: TypeGridState) => {
    const colTotals = Array.from({ length: g[0]?.length }, () => 0);
    const rowTotals = Array.from({ length: g.length }, () => 0);
    g.forEach((rows, x) => {
      rows.forEach((cell, y) => {
        if (isTent(x, y, g)) {
          colTotals[y] += 1;
          rowTotals[x] += 1;
        }
      });
    });
    return [colTotals, rowTotals];
  };

  const [colTotals, rowTotals] = useMemo(() => calculateTotals(grid), [grid]);

  const toggleCell = (x: number, y: number) => {
    if (!isBlank(x, y)) return;
    else updateGrid(x, y, next);
    toggleNext();
  };

  const submitGrid = async (name: string, isPublic: boolean) => {
    const treeCoordinates: TypeCoordinates = [];
    const tentCoordinates: TypeCoordinates = [];
    grid.forEach((rows, x) => {
      rows.forEach((val, y) => {
        if (isTree(x, y)) treeCoordinates.push([x, y]);
        else if (isTent(x, y)) tentCoordinates.push([x, y]);
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

  const onSubmit = () => {
    const error = checkGridForErrors();
    if (error) {
      setError(error);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalSave = (name: string, isPublic: boolean) => {
    setIsModalOpen(false);
    submitGrid(name, isPublic);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSubmittedId(null);
  };

  const checkGridForErrors = () => {
    const isInGrid = (x: number, y: number): boolean =>
      x >= 0 && y >= 0 && x < height && y < width;

    const getBorderingCells = (x: number, y: number): TypeCoordinates =>
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
      ).filter(([cellX, cellY]) => isInGrid(cellX, cellY));

    const getAdjacentCells = (x: number, y: number): TypeCoordinates =>
      (
        [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ] as TypeCoordinates
      ).filter(([cellX, cellY]) => isInGrid(cellX, cellY));

    let borderingTents = false;

    grid.forEach((rows, x) => {
      rows.forEach((cell, y) => {
        if (isTent(x, y)) {
          getBorderingCells(x, y).forEach(([bx, by]) => {
            if (isTent(bx, by)) {
              borderingTents = true;
            }
          });
        }
      });
    });

    if (borderingTents) return "Error: some tents are bordering each other!";

    const trees: TypeCoordinates = [];
    grid.forEach((rows, x) => {
      rows.forEach((val, y) => {
        if (isTree(x, y)) trees.push([x, y]);
      });
    });

    const gridWithTrees = (): TypeGridState =>
      Array.from({ length: height }, (_, x) =>
        Array.from({ length: width }, (_, y) => (isTree(x, y) ? "tree" : "")),
      );

    const getAdjacentEmptyCells = (
      x: number,
      y: number,
      g: TypeGridState,
    ): TypeCoordinates =>
      getAdjacentCells(x, y).filter(([cellX, cellY]) =>
        isBlank(cellX, cellY, g),
      );

    const isBorderingPlacedTent = (
      x: number,
      y: number,
      grid: TypeGridState,
    ): boolean =>
      getBorderingCells(x, y).some(([cellX, cellY]) =>
        isTent(cellX, cellY, grid),
      );

    let solutions: string[] = [];

    const solveNextTree = (
      treeIndex: number,
      solveGrid: TypeGridState,
    ): void => {
      if (solutions.length > 1) return;

      if (treeIndex === trees.length) {
        const [solveColTotals, solveRowTotals] = calculateTotals(solveGrid);

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
        if (!isBorderingPlacedTent(cx, cy, solveGrid)) {
          solveGrid[cx][cy] = "tent";
          solveNextTree(treeIndex + 1, solveGrid);
          solveGrid[cx][cy] = "";
          if (solutions.length > 1) return;
        }
      }
    };

    solveNextTree(0, gridWithTrees());

    if (solutions.length === 0)
      return "Error: no valid solution exists for this puzzle!";
    if (solutions.length > 1)
      return "Error: more than one valid solution exists — the puzzle is ambiguous!";
  };

  return (
    <div className="max-w-xl flex flex-col items-center m-auto">
      <GridToolBar>
        <div className="flex flex-between justify-between w-full">
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
          </div>
          <div>
            <button
              className="cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
              onClick={() => clear()}
              disabled={historyIndex <= 0}
            >
              Restart
            </button>
          </div>
        </div>
      </GridToolBar>
      <Grid
        height={height}
        width={width}
        grid={grid}
        colTotals={colTotals}
        rowTotals={rowTotals}
        onClickCell={toggleCell}
      />
      <GridToolBar>
        <button
          className="w-full cursor-pointer mt-6 text-lg font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 my-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/10"
          disabled={next === "tent" || historyIndex === 0 || !!error}
          onClick={onSubmit}
        >
          Submit
        </button>
      </GridToolBar>
      {error && <div className="mt-8 text-red-200">{error}</div>}
      <SubmitModal
        isOpen={isModalOpen}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        link={`${window.location.origin}/play/${submittedId}`}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default BuildGrid;
