"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";

type TypeSubmitModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (name: string, isPublic: boolean) => void;
};

export function SubmitModal({
  isOpen,
  onCancel,
  onSave,
}: TypeSubmitModalProps) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setIsPublic(false);
      setNameError(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onSave(name, isPublic);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Submit Puzzle">
      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="puzzle-author-name"
          >
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="puzzle-author-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) {
                setNameError(false);
              }
            }}
            className={`rounded border bg-primary px-3 py-2 text-sm text-secondary focus:outline-none ${
              nameError
                ? "border-red-500 focus:border-red-500"
                : "border-tertiary focus:border-accent"
            }`}
            placeholder="Your name"
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-400">Name is required.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="puzzle-is-public"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-tertiary h-4 w-4 cursor-pointer"
          />
          <label
            htmlFor="puzzle-is-public"
            className="text-sm font-medium cursor-pointer select-none"
          >
            Make public
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-tertiary px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-sm py-1 px-4"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary text-sm py-1 px-4"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default SubmitModal;
