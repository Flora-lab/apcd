// src/components/ui/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {title && (
          <div className="border-b px-4 py-2 font-bold text-lg">{title}</div>
        )}
        <div className="p-4">{children}</div>
        <div className="flex justify-end p-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
