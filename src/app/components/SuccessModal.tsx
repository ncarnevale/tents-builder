"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

type TypeSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  link: string;
};

export function SuccessModal({ isOpen, onClose, link }: TypeSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(link);

  useEffect(() => {
    setFullUrl(`${window.location.origin}${link}`);
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = fullUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-4 flex flex-col gap-4">
        <p className="text-gray-300 text-sm">
          Congrats! You've successfully submitted a new puzzle. Copy your link
          below to share.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-blue-400 truncate select-all">
            {fullUrl}
            {link}
          </div>
          <button
            onClick={handleCopy}
            className="cursor-pointer text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
        <button
          onClick={onClose}
          className="cursor-pointer text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default SuccessModal;
