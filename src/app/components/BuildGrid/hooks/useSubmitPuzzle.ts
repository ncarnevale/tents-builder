import { useState } from "react";

import type { TypeGridState } from "../../../types";
import type { CreateGridResponse } from "../../../services/types";
import postGrid from "../../../services/postGrid";

import { getGridDimensions } from "../../helpers/gridHelpers";
import { collectTreeTentCoordinates } from "../../helpers/collectTreeTentCoordinates";
import validateGrid from "../../helpers/validateGrid";

export function useSubmitPuzzle(grid: TypeGridState) {
  const [width, height] = getGridDimensions(grid);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);

  const validatePuzzle = async (): Promise<boolean> => {
    setIsCalculating(true);
    const validationError = await validateGrid(grid, {
      onSetNodeCount: (count) => setNodeCount(count),
    });
    setIsCalculating(false);
    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  };

  const submitPuzzle = async (
    name: string,
    isPublic: boolean,
  ): Promise<CreateGridResponse> => {
    const { treeCoordinates, tentCoordinates } =
      collectTreeTentCoordinates(grid);

    return postGrid({
      width,
      height,
      treeCoordinates,
      tentCoordinates,
      author: name,
      isPublic,
    });
  };

  return {
    error,
    setError,
    isCalculating,
    nodeCount,
    validatePuzzle,
    submitPuzzle,
  };
}
