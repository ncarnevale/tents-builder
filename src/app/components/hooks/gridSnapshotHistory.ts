export type TypeSnapshotHistory<T> = {
  history: T[];
  index: number;
};

export function pushSnapshot<T>(
  prev: TypeSnapshotHistory<T>,
  next: T,
): TypeSnapshotHistory<T> {
  return {
    history: [...prev.history.slice(0, prev.index + 1), next],
    index: prev.index + 1,
  };
}

export function undoSnapshot<T>(
  prev: TypeSnapshotHistory<T>,
): TypeSnapshotHistory<T> {
  if (prev.index < 1) return prev;
  return { ...prev, index: prev.index - 1 };
}

export function redoSnapshot<T>(
  prev: TypeSnapshotHistory<T>,
): TypeSnapshotHistory<T> {
  if (prev.index + 1 >= prev.history.length) return prev;
  return { ...prev, index: prev.index + 1 };
}

export function resetSnapshotHistory<T>(
  prev: TypeSnapshotHistory<T>,
): TypeSnapshotHistory<T> {
  return {
    history: [prev.history[0]],
    index: 0,
  };
}
