import { describe, expect, it } from "vitest";

import {
  pushSnapshot,
  redoSnapshot,
  resetSnapshotHistory,
  undoSnapshot,
} from "./gridSnapshotHistory";

describe("gridSnapshotHistory", () => {
  const initial = { history: ["a", "b", "c"] as string[], index: 2 };

  it("pushSnapshot drops redo tail after current index and appends", () => {
    const afterUndo = undoSnapshot(initial);
    expect(afterUndo.index).toBe(1);

    const pushed = pushSnapshot(afterUndo, "x");
    expect(pushed.history).toEqual(["a", "b", "x"]);
    expect(pushed.index).toBe(2);
  });

  it("undoSnapshot and redoSnapshot respect bounds", () => {
    const start = { history: ["a"], index: 0 };
    expect(undoSnapshot(start)).toEqual(start);

    const pushed = pushSnapshot(start, "b");
    expect(redoSnapshot(pushed)).toEqual(pushed);

    const undone = undoSnapshot(pushed);
    expect(undone.index).toBe(0);
    const redone = redoSnapshot(undone);
    expect(redone.index).toBe(1);
  });

  it("resetSnapshotHistory keeps first entry only", () => {
    const s = { history: ["a", "b"], index: 1 };
    expect(resetSnapshotHistory(s)).toEqual({ history: ["a"], index: 0 });
  });
});
