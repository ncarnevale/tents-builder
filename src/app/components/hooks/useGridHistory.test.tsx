// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { TypeGridState } from "@/app/types";

import { useGridHistory } from "./useGridHistory";

const seed2x2: TypeGridState = [
  ["", ""],
  ["", ""],
];

describe("useGridHistory", () => {
  it("starts at index 0 with cloned seed grid", () => {
    const { result } = renderHook(() => useGridHistory(seed2x2));

    expect(result.current.gridHistory.index).toBe(0);
    expect(result.current.gridHistory.history).toHaveLength(1);
    expect(result.current.grid).toEqual(seed2x2);
    expect(result.current.grid).not.toBe(seed2x2);
  });

  it("commitEdit, undo, redo, and resetHistory", () => {
    const { result } = renderHook(() => useGridHistory(seed2x2));

    act(() => {
      result.current.commitEdit(0, 0, "tent");
    });
    expect(result.current.grid[0][0]).toBe("tent");
    expect(result.current.gridHistory.index).toBe(1);

    act(() => {
      result.current.undoHistory();
    });
    expect(result.current.grid[0][0]).toBe("");
    expect(result.current.gridHistory.index).toBe(0);

    act(() => {
      result.current.redoHistory();
    });
    expect(result.current.grid[0][0]).toBe("tent");

    act(() => {
      result.current.resetHistory();
    });
    expect(result.current.gridHistory.index).toBe(0);
    expect(result.current.gridHistory.history).toHaveLength(1);
    expect(result.current.grid[0][0]).toBe("");
  });

  it("truncates redo branch when committing after undo", () => {
    const { result } = renderHook(() => useGridHistory(seed2x2));

    act(() => result.current.commitEdit(0, 0, "tent"));
    act(() => result.current.commitEdit(0, 0, "."));
    expect(result.current.gridHistory.history).toHaveLength(3);

    act(() => result.current.undoHistory());
    expect(result.current.grid[0][0]).toBe("tent");

    act(() => result.current.commitEdit(0, 1, "tent"));
    expect(result.current.gridHistory.history).toHaveLength(3);
    expect(result.current.gridHistory.index).toBe(2);
    expect(result.current.grid[0][0]).toBe("tent");
    expect(result.current.grid[0][1]).toBe("tent");
  });
});
