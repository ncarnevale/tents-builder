"use client";

import { GRID_HEIGHT, GRID_WIDTH } from "@/app/components/constants";
import BuildGrid from "../components/BuildGrid";

function BuildPage() {
  return <BuildGrid width={GRID_WIDTH} height={GRID_HEIGHT} />;
}

export default BuildPage;
