import { afterEach, describe, expect, it, vi } from "vitest";

import type { TypeGridState } from "@/app/types";
import { gridFixtures } from "./validateGrid.fixtures";
import validateGrid from "./validateGrid";

describe("validateGrid", () => {
  describe("core behavior", () => {
    it("returns undefined for a valid uniquely solvable puzzle", async () => {
      const grid = structuredClone(gridFixtures.uniqueValid2x2);
      const onSetNodeCount = vi.fn();

      await expect(
        validateGrid(grid, { onSetNodeCount }),
      ).resolves.toBeUndefined();
      expect(onSetNodeCount).toHaveBeenLastCalledWith(0);
      expect(grid).toEqual(gridFixtures.uniqueValid2x2);
    });

    it("returns undefined for an empty grid", async () => {
      const grid = structuredClone(gridFixtures.empty3x3);
      await expect(validateGrid(grid)).resolves.toBeUndefined();
    });
  });

  describe("invalid grids", () => {
    it("returns an error when any tents border each other orthogonally", async () => {
      const grid = structuredClone(gridFixtures.borderingOrthogonalWithTrees3x3);

      await expect(validateGrid(grid)).resolves.toBe(
        "Error: some tents are bordering each other!",
      );
    });

    it("returns an error when any tents border each other diagonally", async () => {
      const grid = structuredClone(gridFixtures.borderingDiagonalWithTrees3x3);

      await expect(validateGrid(grid)).resolves.toBe(
        "Error: some tents are bordering each other!",
      );
    });

    it("returns an error the tent is not adjacent to its tree", async () => {
      const grid = structuredClone(gridFixtures.noSolutionDiagonalTent2x2);

      await expect(validateGrid(grid)).resolves.toBe(
        "Error: no valid solution exists for this puzzle!",
      );
    });

    it("returns an error when number of trees and tents are unequal", async () => {
      const grid = structuredClone(gridFixtures.totalsCantSatisfyAllTrees3x3);

      await expect(validateGrid(grid)).resolves.toBe(
        "Error: no valid solution exists for this puzzle!",
      );
    });
  });

  describe("ambiguity detection", () => {
    it("returns an ambiguity error when more than one solution exists", async () => {
      const ambiguousGrid = structuredClone(gridFixtures.ambiguousSwap2x3);

      await expect(validateGrid(ambiguousGrid)).resolves.toBe(
        "Error: more than one valid solution exists — the puzzle is ambiguous!",
      );
    });
  });
});

describe("validateGrid larger valid combinations", () => {
  it("accepts a larger valid puzzle with separated tents", async () => {
    const grid = structuredClone(gridFixtures.validLarger5x5A);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });

  it("accepts another layout with multiple trees/tents", async () => {
    const grid = structuredClone(gridFixtures.validLarger5x5B);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });

  it("accepts a larger 10x10 puzzle with a unique single pair", async () => {
    const grid = structuredClone(gridFixtures.validUnique10x10SinglePair);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });

  it("accepts an oversized 16x16 empty puzzle", async () => {
    const grid = structuredClone(gridFixtures.validOversized16x16Empty);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });

  it("accepts a dense 15x15 valid stress puzzle", async () => {
    const grid = structuredClone(gridFixtures.validDense15x15Stress);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });

  it("accepts a randomized dense 20x20 valid puzzle", async () => {
    const grid = structuredClone(gridFixtures.validRandomDense20x20);

    await expect(validateGrid(grid)).resolves.toBeUndefined();
  });
});

describe("validateGrid larger invalid combinations", () => {
  it("returns bordering error for a larger grid", async () => {
    const grid = structuredClone(gridFixtures.invalidBorderingOrthogonal6x6);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: some tents are bordering each other!",
    );
  });

  it("returns no-solution when tree/tent counts are unequal in larger grid", async () => {
    const grid = structuredClone(gridFixtures.invalidUnequalTreesAndTents6x6);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: no valid solution exists for this puzzle!",
    );
  });

  it("returns no-solution when no orthogonal tent candidate exists in larger grid", async () => {
    const grid = structuredClone(gridFixtures.invalidNoOrthogonalTentCandidate6x6);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: no valid solution exists for this puzzle!",
    );
  });
});

describe("validateGrid larger ambiguity combinations", () => {
  it("returns ambiguity error for ambiguous5x5 fixture", async () => {
    const grid = structuredClone(gridFixtures.ambiguous5x5);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: more than one valid solution exists — the puzzle is ambiguous!",
    );
  });

  it("returns ambiguity error for a larger multi-swap layout", async () => {
    const grid = structuredClone(gridFixtures.ambiguousDoubleSwap4x8);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: more than one valid solution exists — the puzzle is ambiguous!",
    );
  });

  it("returns ambiguity error for a hidden ambiguous 10x20 dense layout", async () => {
    const grid = structuredClone(gridFixtures.ambiguousHidden10x20Dense);

    await expect(validateGrid(grid)).resolves.toBe(
      "Error: more than one valid solution exists — the puzzle is ambiguous!",
    );
  });
});

describe("validateGrid timeout path", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("./gridHelpers");
  });

  it(
    "returns a timeout error when the step limit is reached",
    async () => {
    vi.resetModules();

    // Mock helpers to expand branching and drive step-count timeout.
    vi.doMock("./gridHelpers", async (importOriginal) => {
      const actual = await importOriginal<typeof import("./gridHelpers")>();
      return {
        ...actual,
        calculateTotals: (g: TypeGridState) => [
          new Array(g[0].length).fill(g.length),
          new Array(g.length).fill(g[0].length),
        ],
        isTent: () => false,
        isTree: (x: number, y: number, g: TypeGridState) => g[x][y] === "tree",
      };
    });

    const { default: mockedValidateGrid } = await import("./validateGrid");
    const onSetNodeCount = vi.fn();

    const grid = structuredClone(gridFixtures.timeoutStress8x8);

    await expect(
      mockedValidateGrid(grid, {
        onSetNodeCount,
        maxSolverSteps: 25000,
        yieldEverySteps: 0,
      }),
    ).resolves.toBe("Error: solver timed out while validating this puzzle.");
      expect(onSetNodeCount).toHaveBeenLastCalledWith(0);
    },
  );
});
