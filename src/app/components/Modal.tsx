"use client";

import { useRef } from "react";

type TypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

function Modal({ isOpen, onClose, children, title }: TypeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="mx-4 flex w-full max-w-sm flex-col rounded-lg border border-tertiary bg-primary shadow-xl">
        {title && (
          <div className="border-b border-tertiary px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
