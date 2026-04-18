"use client";

function Instructions() {
  return (
    <div className="text-md">
      <div className="mb-4">
        <b>Instructions:</b>
      </div>
      Place a tent adjacent to a tree horizontally or vertically. Each tree
      should have a corresponding tent. Tents can never border each other, not
      even diagonally. The numbers outside the grid indicate the number of tents
      in each row or column.
    </div>
  );
}

export default Instructions;
