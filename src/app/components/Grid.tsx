"use client";

import { Fragment, ReactNode } from "react";

import type { TypeCell, TypeCoordinates } from "../types";
import { getGridDimensions } from "./helpers/gridHelpers";

type TypeGridProps = {
  grid: TypeCell[][];
  colTotals: number[];
  rowTotals: number[];
  onClickCell: (x: number, y: number) => void;
  isCellClickable?: (row: number, col: number, cell: TypeCell) => boolean;
  highlightCells?: TypeCoordinates;
};
function Grid({
  grid,
  colTotals,
  rowTotals,
  onClickCell,
  isCellClickable = () => true,
  highlightCells,
}: TypeGridProps) {
  const [width, height] = getGridDimensions(grid);
  const size = width > 10 || height > 10 ? "large" : "small";

  const isHighlighted = (x: number, y: number) =>
    highlightCells?.some(([xx, yy]) => xx === x && yy === y);

  return (
    <div
      className={`w-full flex flex-col items-center max-w-xl ${size === "large" ? "text-md md:text-xl" : "text-3xl md:text-4xl"} `}
    >
      <div
        className="grid gap-1 w-full"
        style={{
          gridTemplateColumns: `repeat(${width + 1}, minmax(0, 1fr))`,
        }}
      >
        <Cell>{""}</Cell>
        {colTotals.map((n, i) => (
          <Cell key={`colTotal-${i}`}>
            <b>{n}</b>
          </Cell>
        ))}
        {grid.map((row, x) => (
          <Fragment key={`row-${x}`}>
            <Cell key={`rowTotal-${x}`}>
              <b>{rowTotals[x]}</b>
            </Cell>
            {row.map((val, y) => (
              <GridCell
                key={`${x}-${y}`}
                row={x}
                col={y}
                value={val}
                onClick={() => onClickCell(x, y)}
                isClickable={isCellClickable(x, y, val)}
                isDimmed={val === "" && !isCellClickable(x, y, val)}
                isHighlighted={isHighlighted(x, y)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

type TypeGridCellProps = {
  row: number;
  col: number;
  value: TypeCell;
  isClickable?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
};
function GridCell({
  row,
  col,
  value,
  onClick,
  isClickable = true,
  isDimmed = false,
  isHighlighted = false,
}: TypeGridCellProps) {
  const cellToEmoji = (t: TypeCell) => {
    switch (t) {
      case "tree":
        return "🌳";
      case "tent":
        return "⛺";
      case ".":
        return "●";
      case "":
      default:
        return "";
    }
  };

  return (
    <div
      aria-label={`row ${row + 1}, column ${col + 1}`}
      onClick={() => {
        if (isClickable) onClick();
      }}
      className={[
        "aspect-square w-full flex items-center justify-center rounded-sm border",
        isClickable ? "cursor-pointer" : "cursor-default",
        isHighlighted && "bg-emerald-500/22",
        isDimmed && "opacity-[0.58] cursor-not-allowed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {cellToEmoji(value)}
    </div>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <div className="aspect-square w-full flex items-center justify-center rounded-sm">
      {children}
    </div>
  );
}

export default Grid;
