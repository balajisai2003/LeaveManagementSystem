import React, { useState } from "react";

export default function ConfirmationDialog({
  actionType,
  onConfirm,
  onCancel,
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (actionType === "Reject" && !reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {actionType === "Approve" ? "Confirm Approval" : "Confirm Rejection"}
        </h2>
        {actionType === "Reject" && (
          <div className="mb-5">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Rejection
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
              placeholder="Provide a reason for rejection..."
              rows={3}
            />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2 text-sm font-medium rounded-md shadow-sm focus:ring-2 ${
              actionType === "Approve"
                ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300"
                : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
