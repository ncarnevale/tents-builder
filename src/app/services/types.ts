import type { TypeCoordinates } from "../types";

export type CreateGridParams = {
  width: number;
  height: number;
  treeCoordinates: TypeCoordinates;
  tentCoordinates: TypeCoordinates;
  author: string;
  isPublic: boolean;
};

export type CreateGridResponse = {
  id: string;
};

export type TypeApiGrid = {
  id: string;
  width: number;
  height: number;
  tree_coordinates: TypeCoordinates;
  tent_coordinates: TypeCoordinates;
  author: string | null;
  is_public: boolean;
  created_at: string;
};

export type TypePartialApiGrid = {
  id: string;
  author: string | null;
  width: number;
  height: number;
  created_at: string;
};
