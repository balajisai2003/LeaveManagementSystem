import React from "react";

const DeleteConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-xl">
        <p className="text-gray-800 text-lg font-medium mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-gray-600 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
