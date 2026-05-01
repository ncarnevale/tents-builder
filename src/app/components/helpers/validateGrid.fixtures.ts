import type { TypeCell, TypeGridState } from "@/app/types";

type GridToken = "tree" | "tent" | "----";

const tokenToCell: Record<GridToken, TypeCell> = {
  tree: "tree",
  tent: "tent",
  "----": "",
};

const gridFromTokens = (rows: string[]): TypeGridState => {
  return rows.map((row) =>
    row
      .trim()
      .split(/\s+/)
      .map((token) => {
        if (!(token in tokenToCell)) {
          throw new Error(`Unknown fixture token: ${token}`);
        }
        return tokenToCell[token as GridToken];
      }),
  );
};

export const gridFixtures = {
  empty3x3: gridFromTokens([
    "---- ---- ----",
    "---- ---- ----",
    "---- ---- ----",
  ]),
  uniqueValid2x2: gridFromTokens([
    "tree tent",
    "---- ----",
  ]),
  borderingOrthogonalWithTrees3x3: gridFromTokens([
    "tree tent tent",
    "---- ---- tree",
    "---- ---- ----",
  ]),
  borderingDiagonalWithTrees3x3: gridFromTokens([
    "tree tent ----",
    "---- ---- tent",
    "---- ---- tree",
  ]),
  noSolutionDiagonalTent2x2: gridFromTokens([
    "tree ----",
    "---- tent",
  ]),
  totalsCantSatisfyAllTrees3x3: gridFromTokens([
    "tree tent ----",
    "---- ---- ----",
    "---- ---- tree",
  ]),
  ambiguousSwap2x3: gridFromTokens([
    "tent tree ----",
    "---- tree tent",
  ]),
  validLarger5x5A: gridFromTokens([
    "tree tent ---- ---- ----",
    "---- ---- ---- ---- ----",
    "---- ---- tree tent ----",
    "---- ---- ---- ---- ----",
    "---- ---- ---- ---- ----",
  ]),
  validLarger5x5B: gridFromTokens([
    "---- tree tent ---- ----",
    "---- ---- ---- ---- ----",
    "---- ---- ---- ---- ----",
    "---- ---- tree tent ----",
    "---- ---- ---- ---- ----",
    "---- ---- ---- ---- ----",
  ]),
  ambiguous5x5: gridFromTokens([
    "tent tree tree tent ----",
    "---- ---- ---- ---- ----",
    "---- ---- ---- ---- ----",
    "---- ---- ---- tent ----",
    "---- tree ---- tree ----",
    "---- tent ---- ---- ----",
  ]),
  timeoutStress8x8: gridFromTokens([
    "---- ---- ---- ---- ---- ---- ---- ----",
    "---- tree ---- tree ---- tree ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ----",
    "---- tree ---- tree ---- tree ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ----",
    "---- tree ---- tree ---- tree ---- ----",
    "---- ---- tree ---- tree ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ----",
  ]),
  validUnique10x10SinglePair: gridFromTokens([
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- tree tent ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
  ]),
  validOversized16x16Empty: gridFromTokens([
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
  ]),
  validDense15x15Stress: gridFromTokens([
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
    "---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
    "tree tent ---- tree tent ---- tree tent ---- tree tent ---- tree tent ----",
  ]),
  validRandomDense20x20: gridFromTokens([
    "tent tree ---- tent tree tree tent ---- tree tent ---- tent tree tent tree ---- tent tree tent tree",
    "---- ---- ---- tree ---- ---- ---- ---- tree ---- tree ---- ---- ---- ---- ---- ---- ---- ---- tree",
    "---- tent ---- tent ---- ---- tent ---- tent ---- tent ---- ---- tent ---- ---- tent tree ---- tent",
    "---- tree ---- ---- ---- ---- tree ---- ---- ---- ---- ---- ---- tree ---- ---- ---- ---- ---- ----",
    "tent tree ---- tent ---- tent tree ---- tent tree tent ---- tent ---- tree tent ---- tent ---- tent",
    "---- ---- ---- tree tree ---- ---- ---- tree ---- tree ---- tree ---- tree ---- ---- tree ---- tree",
    "---- tent tree ---- tent ---- tent tree tent ---- tent ---- tent tree tent ---- tent tree ---- tent",
    "tree ---- tree ---- ---- ---- tree ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- tree",
    "tent ---- tent ---- ---- ---- tent ---- ---- tent ---- tent tree ---- tent ---- tree tent ---- tent",
    "---- ---- ---- ---- ---- ---- tree ---- tree tree tree ---- ---- ---- tree ---- ---- ---- ---- tree",
    "---- ---- tent ---- tent tree tent tree tent ---- tent tree tent ---- tent tree tent tree tent ----",
    "---- ---- tree ---- ---- ---- ---- ---- ---- ---- tree ---- tree ---- ---- ---- tree ---- tree ----",
    "---- ---- tree tent tree tent ---- tent ---- ---- tent ---- tent ---- ---- ---- tent ---- tent tree",
    "---- ---- ---- ---- ---- tree ---- tree ---- ---- ---- ---- ---- ---- tree ---- ---- tree ---- ----",
    "tent ---- tent tree ---- tent tree tent ---- tent tree ---- ---- ---- tent ---- ---- tent ---- ----",
    "tree ---- ---- tree ---- ---- ---- tree ---- ---- ---- ---- ---- ---- tree ---- ---- ---- ---- ----",
    "---- tent ---- tent ---- tent tree tent ---- tent tree tent ---- ---- tent ---- tent tree tent ----",
    "---- tree ---- ---- ---- ---- ---- ---- ---- ---- ---- tree ---- tree ---- tree ---- ---- tree ----",
    "---- ---- tent ---- ---- ---- tent ---- tent tree tent tree ---- tent ---- tent ---- ---- tent tree",
    "---- ---- tree ---- ---- ---- tree ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----",
  ]),
  // Hidden ambiguity is in the top-right corner
  ambiguousHidden10x20Dense: gridFromTokens([
    "tent ---- tent ---- tent ---- tent ---- ---- ---- ---- ---- tent ---- tent ---- tent ---- ---- tent",
    "tree ---- tree ---- tree ---- tree ---- ---- ---- ---- ---- tree tree tree tree tree ---- tree tree",
    "tent ---- ---- tent ---- ---- tent ---- ---- tent ---- tent ---- tent ---- tent ---- ---- tent ----",
    "tree ---- ---- tree ---- ---- tree ---- ---- tree ---- tree ---- ---- ---- ---- ---- ---- ---- ----",
    "tent ---- tent ---- tent ---- tent ---- tent tree ---- ---- ---- tent ---- tent ---- ---- tent ----",
    "tree ---- tree ---- tree ---- tree ---- ---- tree tent ---- ---- tree tree tree ---- tree tree ----",
    "---- tent ---- tent ---- ---- tent ---- tent ---- ---- ---- ---- ---- tent ---- ---- tent ---- tent",
    "---- tree ---- tree ---- ---- tree ---- tree ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- tree",
    "tent ---- tent ---- ---- ---- ---- tent ---- tent ---- tent ---- ---- tent ---- ---- tent ---- ----",
    "tree ---- tree ---- ---- ---- ---- tree ---- tree ---- tree ---- ---- tree ---- ---- tree ---- ----",
  ]),
  invalidBorderingOrthogonal6x6: gridFromTokens([
    "tree tent tent tree ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
  ]),
  invalidUnequalTreesAndTents6x6: gridFromTokens([
    "tree tent ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- tree ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- tree ----",
    "---- ---- ---- ---- ---- ----",
  ]),
  invalidNoOrthogonalTentCandidate6x6: gridFromTokens([
    "tree ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- tent",
  ]),
  ambiguousDoubleSwap4x8: gridFromTokens([
    "tent tree ---- ---- ---- tent tree ----",
    "---- tree tent ---- ---- ---- tree tent",
    "---- ---- ---- ---- ---- ---- ---- ----",
    "---- ---- ---- ---- ---- ---- ---- ----",
  ]),
} as const;