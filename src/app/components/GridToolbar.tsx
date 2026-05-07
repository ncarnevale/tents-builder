"use client";

import { ReactNode } from "react";

type TypeGridToolBarProps = {
  children?: ReactNode;
  gridWidth: number;
};

function GridToolBar({ gridWidth, children = null }: TypeGridToolBarProps) {
  return (
    <div className={`mb-4 w-full ${gridWidth}`} style={{ padding: `0 calc(100% / (${gridWidth + 2} * 2))` }}>
      {children}
    </div>
  );
}

export default GridToolBar;
