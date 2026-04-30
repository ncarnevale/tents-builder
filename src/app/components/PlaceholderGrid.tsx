"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type TypePlaceholderGridProps = { showLoader?: boolean };
export default function PlaceHolderGrid({
  showLoader = false,
}: TypePlaceholderGridProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!showLoader) {
      setShowSpinner(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [showLoader]);

  return (
    <div className="relative h-[630px]">
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center pb-40">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}
