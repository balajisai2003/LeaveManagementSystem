import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComponentNotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Error: Component Not Authorized</h2>
      <p className="mb-6">You do not have permission to access this component.</p>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        onClick={() => navigate('/')}
      >
        Go Back
      </button>
    </div>
  );
};

export default ComponentNotAuthorized;
