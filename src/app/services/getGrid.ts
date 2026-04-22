import { TypeGrid } from "../types";
import type { TypeApiGrid } from "./types";

export default async function (id: string): Promise<TypeGrid> {
  const resp = await fetch(`/api/grids/${id}`);
  const data = (await resp.json()) as TypeApiGrid;
  return {
    id: data.id,
    width: data.width,
    height: data.height,
    treeCoordinates: data.tree_coordinates,
    tentCoordinates: data.tent_coordinates,
    author: data.author || "",
    isPublic: data.is_public,
  };
}
