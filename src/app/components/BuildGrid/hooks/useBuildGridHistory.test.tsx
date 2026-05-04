// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBuildGridHistory } from "./useBuildGridHistory";

describe("useBuildGridHistory", () => {
  it("sets treeAwaitingTent when placing tree and clears on tent", () => {
    const { result } = renderHook(() => useBuildGridHistory(2, 2));

    act(() => {
      result.current.commitEdit(0, 1, "tree");
    });
    expect(result.current.treeAwaitingTent).toEqual([0, 1]);

    act(() => {
      result.current.commitEdit(1, 1, "tent");
    });
    expect(result.current.treeAwaitingTent).toBeNull();
  });

  it("restores treeAwaitingTent on undo and redo", () => {
    const { result } = renderHook(() => useBuildGridHistory(2, 2));

    act(() => {
      result.current.commitEdit(0, 1, "tree");
    });
    expect(result.current.treeAwaitingTent).toEqual([0, 1]);

    act(() => {
      result.current.commitEdit(1, 1, "tent");
    });
    expect(result.current.treeAwaitingTent).toBeNull();

    act(() => {
      result.current.undoHistory();
    });
    expect(result.current.gridHistory.index).toBe(1);
    expect(result.current.treeAwaitingTent).toEqual([0, 1]);

    act(() => {
      result.current.redoHistory();
    });
    expect(result.current.gridHistory.index).toBe(2);
    expect(result.current.treeAwaitingTent).toBeNull();
  });
});
