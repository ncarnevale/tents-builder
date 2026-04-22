"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import StartModal from "../components/StartModal";
import { useRouter } from "next/navigation";

const PlaceHolderGrid = () => <div style={{ height: "630px" }} />;

const BuildGrid = dynamic(() => import("../components/BuildGrid"), {
  ssr: false,
  loading: PlaceHolderGrid,
});

function BuildPage() {
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState<[number, number] | undefined>(
    undefined,
  );

  const router = useRouter();

  const handleOnConfirm = (dimensions: [number, number]) => {
    setDimensions(dimensions);
    setIsStartModalOpen(false);
  };

  const onNewPuzzleClick = () => {
    setDimensions(undefined);
    setIsStartModalOpen(true);
  };

  return (
    <>
      <StartModal
        isOpen={isStartModalOpen}
        onConfirm={handleOnConfirm}
        onClose={() => router.push("/")}
      />
      {dimensions ? (
        <BuildGrid
          width={dimensions[0]}
          height={dimensions[1]}
          onNewPuzzleClick={onNewPuzzleClick}
        />
      ) : (
        <PlaceHolderGrid />
      )}
    </>
  );
}

export default BuildPage;
