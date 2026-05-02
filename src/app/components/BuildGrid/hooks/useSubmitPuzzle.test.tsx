// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TypeGridState } from "@/app/types";

import { useSubmitPuzzle } from "./useSubmitPuzzle";

vi.mock("../../../services/postGrid", () => ({
  default: vi.fn(),
}));

vi.mock("../../helpers/validateGrid", () => ({
  default: vi.fn(),
}));

import postGrid from "../../../services/postGrid";
import validateGrid from "../../helpers/validateGrid";

const empty2x2: TypeGridState = [
  ["", ""],
  ["", ""],
];

describe("useSubmitPuzzle", () => {
  beforeEach(() => {
    vi.mocked(validateGrid).mockReset();
    vi.mocked(postGrid).mockReset();
  });

  it("validatePuzzle returns true when validation passes", async () => {
    vi.mocked(validateGrid).mockResolvedValue(undefined);

    const { result } = renderHook(() => useSubmitPuzzle(empty2x2));

    let ok = false;
    await act(async () => {
      ok = await result.current.validatePuzzle();
    });

    expect(ok).toBe(true);
    expect(result.current.error).toBe("");
    expect(validateGrid).toHaveBeenCalledOnce();
  });

  it("validatePuzzle returns false and sets error when validation fails", async () => {
    vi.mocked(validateGrid).mockResolvedValue("Error: invalid puzzle");

    const { result } = renderHook(() => useSubmitPuzzle(empty2x2));

    let ok = true;
    await act(async () => {
      ok = await result.current.validatePuzzle();
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe("Error: invalid puzzle");
  });

  it("submitPuzzle posts the current grid", async () => {
    vi.mocked(postGrid).mockResolvedValue({ id: "abc123" });

    const { result } = renderHook(() => useSubmitPuzzle(empty2x2));

    await act(async () => {
      await result.current.submitPuzzle("Nicky C", true);
    });

    expect(postGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 2,
        height: 2,
        author: "Nicky C",
        isPublic: true,
        treeCoordinates: [],
        tentCoordinates: [],
      }),
    );
  });
});
