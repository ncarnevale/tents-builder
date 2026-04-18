import { TypePartialGrid } from "../types";
import type { TypePartialApiGrid } from "./types";

function parseUtcDate(utcString: string): Date {
  const normalized = utcString.endsWith("Z") ? utcString : `${utcString}Z`;
  return new Date(normalized);
}

export default async function (
  isPublic: boolean = true,
): Promise<TypePartialGrid[]> {
  const resp = await fetch(`/api/grids${isPublic ? "?public=true" : ""}`);
  const data = (await resp.json()) as TypePartialApiGrid[];
  return data.map((item) => ({
    id: item.id,
    author: item.author || "",
    height: item.height,
    width: item.width,
    createdAt: parseUtcDate(item.created_at),
  }));
}
