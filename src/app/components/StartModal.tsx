"use client";
import { useMemo, useState, useEffect } from "react";
import Modal from "./Modal";

type TypeStartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (dimensions: [number, number]) => void;
};

const DEFAULT_SIZES: [number, number][] = [
  [6, 6],
  [12, 12],
  [15, 15],
];

export function StartModal({
  isOpen,
  onClose,
  onConfirm = () => {},
}: TypeStartModalProps) {
  const [width, setWidth] = useState<number | undefined>(DEFAULT_SIZES[0][0]);
  const [height, setHeight] = useState<number | undefined>(DEFAULT_SIZES[0][1]);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const setDimensions = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  };

  const dimensionsToSelectString = (w: number, h: number) => `${w} x ${h}`;

  const selectStringToDimensions = (
    v: string,
  ): [number, number] | undefined => {
    const dimensions = v.split(" x ");
    if (dimensions?.length !== 2) return undefined;
    return [Number(dimensions[0]), Number(dimensions[1])];
  };

  const selectedSize = useMemo(() => {
    if (isCustom) return "custom";
    if (width && height) return dimensionsToSelectString(width, height);
    return "";
  }, [isCustom, width, height]);

  const onSelectSize = (selectedSize: string) => {
    if (selectedSize === "custom") {
      setIsCustom(true);
      setDimensions(DEFAULT_SIZES[0][0], DEFAULT_SIZES[0][1]);
    } else {
      setIsCustom(false);
      const dimensions = selectStringToDimensions(selectedSize);
      if (dimensions) setDimensions(dimensions[0], dimensions[1]);
    }
  };

  const handleOnConfirm = () => {
    if (width && height) {
      onConfirm([width, height]);
      setWidth(undefined);
      setHeight(undefined);
      setIsCustom(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-bold">Select Grid Size</h2>
        <select
          className="border rounded p-2"
          value={selectedSize}
          onChange={(e) => onSelectSize(e.target.value)}
          autoComplete="off"
        >
          {DEFAULT_SIZES.map(([width, height]) => {
            const dimensionStr = dimensionsToSelectString(width, height);
            return (
              <option key={dimensionStr} value={dimensionStr}>
                {dimensionStr}
              </option>
            );
          })}
          <option key="custom" value="custom">
            Custom
          </option>
        </select>

        {isCustom && (
          <div className="flex flex-row gap-2">
            <label className="flex flex-col gap-1 flex-1">
              <span>Width</span>
              <input
                type="number"
                min={3}
                max={15}
                value={width ?? 6}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="border rounded p-2"
              />
            </label>
            <label className="flex flex-col gap-1 flex-1">
              <span>Height</span>
              <input
                type="number"
                min={3}
                max={15}
                value={height ?? 6}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="border rounded p-2"
              />
            </label>
          </div>
        )}

        <button
          onClick={handleOnConfirm}
          disabled={!width || !height}
          className="cursor: pointer mt-2 bg-blue-500 text-white rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}

export default StartModal;
