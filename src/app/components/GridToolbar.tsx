"use client";

import { ReactNode } from "react";

type TypeGridToolBarProps = {
  children?: ReactNode;
  className?: string;
  gridWidth: number;
};

function GridToolBar({
  gridWidth,
  className = "",
  children = null,
}: TypeGridToolBarProps) {
  return (
    <div
      className={`w-full ${gridWidth} ${className}`}
      style={{ padding: `0 calc(100% / (${gridWidth + 2} * 2))` }}
    >
      {children}
    </div>
  );
}

export default GridToolBar;
