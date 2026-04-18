import { useEffect, useRef, useState } from "react";
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
            className="text-sm text-gray-300 font-medium"
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
            className={`bg-gray-800 text-white rounded px-3 py-2 text-sm border focus:outline-none ${
              nameError
                ? "border-red-500 focus:border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
            placeholder="Your name"
          />
          {nameError && (
            <p className="text-red-400 text-xs mt-1">Name is required.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="puzzle-is-public"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
          <label
            htmlFor="puzzle-is-public"
            className="text-sm text-gray-300 font-medium cursor-pointer select-none"
          >
            Make public
          </label>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="cursor-pointer text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="cursor-pointer text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default SubmitModal;
