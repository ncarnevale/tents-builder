// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBuildGridHistory } from "./useBuildGridHistory";

describe("useBuildGridHistory", () => {
  it("starts with an empty grid at index 0", () => {
    const { result } = renderHook(() => useBuildGridHistory(3, 2));

    expect(result.current.gridHistory.index).toBe(0);
    expect(result.current.gridHistory.history).toHaveLength(1);
    expect(result.current.grid).toEqual([
      ["", "", ""],
      ["", "", ""],
    ]);
    expect(result.current.treeAwaitingTent).toBeNull();
  });

  it("commitEdit writes the cell, appends history, and advances index", () => {
    const { result } = renderHook(() => useBuildGridHistory(2, 2));

    act(() => {
      result.current.commitEdit(0, 1, "tree");
    });

    expect(result.current.grid[0][1]).toBe("tree");
    expect(result.current.gridHistory.index).toBe(1);
    expect(result.current.gridHistory.history).toHaveLength(2);
    expect(result.current.treeAwaitingTent).toEqual([0, 1]);
  });

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
