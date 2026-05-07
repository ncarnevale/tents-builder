// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { TypeCell, TypeGridState } from "@/app/types";

import BuildGridStats from "./BuildGridStats";

const emptyGrid = (width: number, height: number): TypeGridState =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "" as TypeCell),
  );

const gridFromRows = (...rows: string[][]): TypeGridState =>
  rows.map((row) => [...row] as TypeGridState[number]);

afterEach(() => {
  cleanup();
});

describe("BuildGridStats", () => {
  it("shows zero tents, trees, and density on an empty grid", () => {
    render(<BuildGridStats grid={emptyGrid(6, 8)} />);

    expect(
      screen.getByRole("status", {
        name: "Tents: 0, Density: 0%",
      }),
    ).toBeInTheDocument();
  });

  it("reflects tree and tent counts and density", () => {
    const withTree = gridFromRows(
      ["tree", ""],
      ["", ""],
    );
    const { rerender } = render(<BuildGridStats grid={withTree} />);

    expect(
      screen.getByRole("status", {
        name: "Tents: 0, Density: 0%",
      }),
    ).toBeInTheDocument();

    rerender(
      <BuildGridStats
        grid={gridFromRows(["tree", "tent"], ["", ""])}
      />,
    );
    expect(
      screen.getByRole("status", {
        name: "Tents: 1, Density: 100%",
      }),
    ).toBeInTheDocument();
  });
});
