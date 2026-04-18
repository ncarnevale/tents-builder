"use client";

import { useEffect, useState } from "react";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/components/constants";
import PlayGrid from "@/app/components/PlayGrid";
import { TypeGrid } from "@/app/types";
import { useParams } from "next/navigation";
import getGrid from "@/app/services/getGrid";

function PlayPage() {
  const [loadedGrid, setLoadedGrid] = useState<TypeGrid | undefined>(undefined);
  const { id } = useParams() as { id: string };

  const loadGrid = async () => {
    const grid = await getGrid(id);
    setLoadedGrid(grid);
  };

  useEffect(() => {
    if (id) loadGrid();
  }, [id]);

  if (!loadedGrid) return <div style={{ height: "630px" }} />;

  return (
    <PlayGrid
      width={GRID_WIDTH}
      height={GRID_HEIGHT}
      trees={loadedGrid.treeCoordinates}
      tents={loadedGrid.tentCoordinates}
    />
  );
}

export default PlayPage;
