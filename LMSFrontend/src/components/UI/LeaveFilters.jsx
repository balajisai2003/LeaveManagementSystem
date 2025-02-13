import React from "react";

const LeaveFilters = ({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetFilters,
}) => {
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Leave ID, Reason, or Leave Type"
          className="p-2 border border-gray-300 rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default LeaveFilters;
