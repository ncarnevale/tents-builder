"use client";

import { Fragment, ReactNode } from "react";

import type { TypeCell } from "../types";
import { getGridDimensions } from "./helpers/gridHelpers";

type TypeGridProps = {
  grid: TypeCell[][];
  colTotals: number[];
  rowTotals: number[];
  onClickCell: (x: number, y: number) => void;
  nonClickableCellTypes?: TypeCell[];
};
function Grid({
  grid,
  colTotals,
  rowTotals,
  onClickCell,
  nonClickableCellTypes = [],
}: TypeGridProps) {
  const [width, height] = getGridDimensions(grid);
  const size = width > 10 || height > 10 ? "large" : "small";

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
                value={val}
                onClick={() => onClickCell(x, y)}
                clickable={!nonClickableCellTypes.includes(val)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

type TypeGridCellProps = {
  value: TypeCell;
  clickable: boolean;
  onClick: () => void;
};
function GridCell({ value, onClick, clickable }: TypeGridCellProps) {
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
      onClick={onClick}
      className={`aspect-square w-full flex items-center justify-center border ${
        clickable ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {cellToEmoji(value)}
    </div>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <div className="aspect-square w-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default Grid;
