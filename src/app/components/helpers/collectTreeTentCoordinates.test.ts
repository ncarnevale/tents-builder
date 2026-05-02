import { describe, expect, it } from "vitest";

import type { TypeGridState } from "@/app/types";

import { collectTreeTentCoordinates } from "./collectTreeTentCoordinates";

describe("collectTreeTentCoordinates", () => {
  it("returns empty lists for an empty grid", () => {
    const grid: TypeGridState = [
      ["", ""],
      ["", ""],
    ];

    expect(collectTreeTentCoordinates(grid)).toEqual({
      treeCoordinates: [],
      tentCoordinates: [],
    });
  });

  it("lists tree and tent positions in row-major scan order", () => {
    const grid: TypeGridState = [
      ["tree", "tent", ""],
      ["", "tree", "tent"],
    ];

    expect(collectTreeTentCoordinates(grid)).toEqual({
      treeCoordinates: [
        [0, 0],
        [1, 1],
      ],
      tentCoordinates: [
        [0, 1],
        [1, 2],
      ],
    });
  });
});
