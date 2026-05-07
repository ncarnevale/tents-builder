"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

type TypeSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  onPrint: () => void;
};

export function SuccessModal({
  isOpen,
  onClose,
  link,
  onPrint,
}: TypeSuccessModalProps) {
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
      <div className="px-6 py-4 border-b border-tertiary/20">
        <h2 className="text-md font-medium">
          Submission successful! Copy link to share.
        </h2>
      </div>
      <div className="px-6 py-4 flex flex-col gap-4 ">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1 truncate select-all rounded border border-tertiary bg-primary px-3 py-2 text-xs text-tertiary">
            {fullUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-primary text-sm py-2 px-3 whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="flex justify-end border-t border-tertiary/20 px-6 py-4">
        <button
          type="button"
          onClick={onPrint}
          className="btn-primary text-sm py-2 px-3 mr-2 whitespace-nowrap"
        >
          Print Puzzle
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary text-sm py-2 px-4"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default SuccessModal;
