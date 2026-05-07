"use client";

import { useMemo } from "react";

import type { TypeGridState } from "../../types";

import {
  buildGridDensityPercent,
  countTents,
  countTrees,
} from "../helpers/buildGridStats";
import { getGridDimensions } from "../helpers/gridHelpers";

type TypeBuildGridStatsProps = {
  grid: TypeGridState;
};

function BuildGridStats({ grid }: TypeBuildGridStatsProps) {
  const [width, height] = getGridDimensions(grid);

  const { tents, trees, density } = useMemo(() => {
    const trees = countTrees(grid);
    const tents = countTents(grid);
    const density = buildGridDensityPercent(tents, height, width);
    return { trees, tents, density };
  }, [grid, width, height]);

  const ariaLabel = `Tents: ${tents}, Density: ${density}%`;

  const rows = [
    { label: "Tents", value: String(tents) },
    { label: "Density", value: `${density}%` },
  ] as const;

  return (
    <div role="status" aria-label={ariaLabel}>
      <div className="flex flex-col items-center gap-x-4 gap-y-0.5 text-xs/0 leading-snug tabular-nums tracking-normal">
        {rows.map(({ label, value }) => (
          <span key={label} className="inline-flex items-baseline gap-1">
            <span className="text-[11px] font-medium text-secondary/65 sm:text-xs">
              {label}:
            </span>
            <span className="text-secondary">{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default BuildGridStats;
