// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Grid from "./Grid";

afterEach(() => {
  cleanup();
});

describe("Grid", () => {
  it("renders the symbol for each cell type", () => {
    render(
      <Grid
        grid={[["tree", "tent", ".", ""]]}
        colTotals={[1, 1, 0, 0]}
        rowTotals={[2]}
        onClickCell={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("row 1, column 1")).toHaveTextContent("🌳");
    expect(screen.getByLabelText("row 1, column 2")).toHaveTextContent("⛺");
    expect(screen.getByLabelText("row 1, column 3")).toHaveTextContent("●");
    expect(screen.getByLabelText("row 1, column 4")).toBeEmptyDOMElement();
  });
});
