import type { CreateGridParams, CreateGridResponse } from "./types";

export default async function (
  params: CreateGridParams,
): Promise<CreateGridResponse> {
  const resp = await fetch("/api/grids", {
    method: "POST",
    body: JSON.stringify(params),
  });

  return (await resp.json()) as CreateGridResponse;
}
