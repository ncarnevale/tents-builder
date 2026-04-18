"use client";

import { GRID_HEIGHT, GRID_WIDTH } from "@/app/components/constants";
import dynamic from "next/dynamic";

const BuildGrid = dynamic(() => import("../components/BuildGrid"), {
  ssr: false,
  loading: () => <div style={{ height: "630px" }} />,
});

function BuildPage() {
  return <BuildGrid width={GRID_WIDTH} height={GRID_HEIGHT} />;
}

export default BuildPage;
