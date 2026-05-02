import type { CreateGridParams, CreateGridResponse } from "./types";

export default async function postGrid(
  params: CreateGridParams,
): Promise<CreateGridResponse> {
  try {
    const resp = await fetch("/api/grids", {
      method: "POST",
      body: JSON.stringify(params),
    });
    return (await resp.json()) as CreateGridResponse;
  } catch {
    return { error: "Network error: could not reach the server." };
  }
}
