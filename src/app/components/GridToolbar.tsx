"use client";

import { ReactNode } from "react";

type TypeGridToolBarProps = {
  children?: ReactNode;
  className?: string;
};

function GridToolBar({ children = null, className = "" }: TypeGridToolBarProps) {
  return (
    <div className={`mb-4 px-4 w-full h-10 ${className}`}>
      {children}
    </div>
  );
}

export default GridToolBar;
