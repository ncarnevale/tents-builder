import { useEffect, useRef, useState } from "react";

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
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-sm mx-4 flex flex-col">
        {title && (
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-white text-lg font-semibold">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
