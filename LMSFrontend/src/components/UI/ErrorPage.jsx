import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorComponent = ({ title, message, type }) => {
  const navigate = useNavigate();

  const typeStyles = {
    error: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-500",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-500",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-500",
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-500",
    },
  };

  const { bg, text, border } = typeStyles[type] || typeStyles.default;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg border-l-4 ${bg} ${border} ${text}`}
    >
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm">{message}</p>
      <div className="mt-4">
        <button
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
