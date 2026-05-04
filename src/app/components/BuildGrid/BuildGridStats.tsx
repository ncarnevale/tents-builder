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

  const ariaLabel = `Tents: ${tents}, Trees: ${trees}, Density: ${density}%`;

  const rows = [
    { label: "Tents", value: String(tents) },
    { label: "Trees", value: String(trees) },
    { label: "Density", value: `${density}%` },
  ] as const;

  return (
      <div
        role="status"
        aria-label={ariaLabel}
      >
        <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1.5 text-[13px] leading-snug tabular-nums tracking-normal sm:justify-start">
          {rows.map(({ label, value }) => (
            <span key={label} className="inline-flex items-baseline gap-1">
              <span className="text-white/58 font-medium text-[11px] sm:text-xs">
                {label}:
              </span>
              <span className="text-white/[0.88]">{value}</span>
            </span>
          ))}
        </div>
      </div>
  );
}

export default BuildGridStats;
