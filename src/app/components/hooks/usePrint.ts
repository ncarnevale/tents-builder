"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function usePrint(): { print: () => void; isPrinting: boolean } {
  const [fromWindowEvents, setFromWindowEvents] = useState(false);
  const [forcePrintLayout, setForcePrintLayout] = useState(false);

  useEffect(() => {
    const onBeforePrint = () => setFromWindowEvents(true);
    const onAfterPrint = () => setFromWindowEvents(false);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  const print = useCallback(() => {
    flushSync(() => setForcePrintLayout(true));
    window.print();
    setForcePrintLayout(false);
  }, []);

  const isPrinting = fromWindowEvents || forcePrintLayout;

  return { print, isPrinting };
}
