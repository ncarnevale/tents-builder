"use client";

type TypeInstructionsProps = {
  includeBuildInstructions?: boolean;
};

function Instructions({
  includeBuildInstructions = false,
}: TypeInstructionsProps) {
  return (
    <div className="pl-4 pt-4 mt-4 text-md">
      <div className="mb-4">
        {includeBuildInstructions && (
          <div className="mb-4">
            <b>Build Instructions:</b>
            <BuildInstructions />
          </div>
        )}
        <b>{`${includeBuildInstructions ? "Play " : ""} Instructions:`}</b>
        <PlayInstructions />
      </div>
    </div>
  );
}

function BuildInstructions() {
  return (
    <div>
      To construct your own tents puzzle, click first to place a tree, then
      place a corresponding tent. On submit, an algorithm will validate your
      grid. Remember that all tents puzzles must have only one possible
      solution.
    </div>
  );
}

function PlayInstructions() {
  return (
    <div>
      Place a tent adjacent to a tree horizontally or vertically. Each tree
      should have exactly one corresponding tent. Tents can never border each
      other, not even diagonally. The numbers outside the grid indicate the
      number of tents in each row or column.
    </div>
  );
}

export default Instructions;
