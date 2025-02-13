import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-yellow-500 text-black p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Error: Component Not Found
        </h2>
        <p className="mb-4">
          The component you are looking for does not exist or has been removed.
        </p>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    </>
  );
};

export default NotFound;
