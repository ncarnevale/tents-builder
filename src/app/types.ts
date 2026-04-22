export type TypeCoordinates = [number, number][];

export type TypeGrid = {
  id: string;
  treeCoordinates: TypeCoordinates;
  tentCoordinates: TypeCoordinates;
  height: number;
  width: number;
  author: string;
  isPublic: boolean;
};

export type TypePartialGrid = {
  id: string;
  author: string;
  height: number;
  width: number;
  createdAt: Date;
};

export type TypeCell = "" | "." | "tree" | "tent";

export type TypeGridState = TypeCell[][];
