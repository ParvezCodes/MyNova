import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Confirm Action
        </h2>
        <p className="mb-6 text-white">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
