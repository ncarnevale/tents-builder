// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePrint } from "./usePrint";

describe("usePrint", () => {
  it("isPrinting reflects beforeprint / afterprint from the window", () => {
    const { result } = renderHook(() => usePrint());

    expect(result.current.isPrinting).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("beforeprint"));
    });
    expect(result.current.isPrinting).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("afterprint"));
    });
    expect(result.current.isPrinting).toBe(false);
  });

  it("print() sets isPrinting for the synchronous window.print() call via flushSync", () => {
    const isPrintingWhenPrintRan: boolean[] = [];
    const { result } = renderHook(() => usePrint());

    vi.spyOn(window, "print").mockImplementation(() => {
      isPrintingWhenPrintRan.push(result.current.isPrinting);
      return undefined;
    });

    act(() => {
      result.current.print();
    });

    expect(window.print).toHaveBeenCalledTimes(1);
    expect(isPrintingWhenPrintRan[0]).toBe(true);
    expect(result.current.isPrinting).toBe(false);

    vi.restoreAllMocks();
  });
});
