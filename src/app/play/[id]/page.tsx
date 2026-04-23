"use client";

import { useEffect, useState } from "react";
import PlayGrid from "@/app/components/PlayGrid";
import { TypeGrid } from "@/app/types";
import { useParams } from "next/navigation";
import getGrid from "@/app/services/getGrid";
import Instructions from "@/app/components/Instructions";
import PlaceHolderGrid from "@/app/components/PlaceholderGrid";

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

  return (
    <>
      {!!loadedGrid ? (
        <PlayGrid
          width={loadedGrid.width}
          height={loadedGrid.height}
          trees={loadedGrid.treeCoordinates}
          tents={loadedGrid.tentCoordinates}
        />
      ) : (
        <PlaceHolderGrid />
      )}
      <Instructions />
    </>
  );
}

export default PlayPage;
