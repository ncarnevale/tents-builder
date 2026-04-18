"use client";

import { ReactNode } from "react";

type TypeGridToolBarProps = { children?: ReactNode };
function GridToolBar({ children = null }: TypeGridToolBarProps) {
  return <div className="mb-4 px-4 w-full h-10">{children}</div>;
}

export default GridToolBar;
