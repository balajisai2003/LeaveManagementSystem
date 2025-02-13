import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const LeaveForm = ({ method, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    reason: "",
    leaveType: "",
    leaveTypeValue:0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
      let leaveTypeValue;

    if (initialData) {
      switch(initialData.leaveType){
        case 'Maternity Leave':
          leaveTypeValue = 1;
          break;
        case 'Paid Leave':
          leaveTypeValue = 2;
          break;
        case 'Casual Leave':
          leaveTypeValue = 3;
          break;
          case 'Sick Leave':
          leaveTypeValue = 3;
          break;
        default:
          leaveTypeValue = 0;
      }
      setFormData({
        startDateTime: initialData.startDateTime || "",
        endDateTime: initialData.endDateTime || "",
        reason: initialData.reason || "",
        leaveType: initialData.leaveType || "",
        leaveTypeValue: leaveTypeValue || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.startDateTime)
      validationErrors.startDateTime = "Start Date is required";
    if (!formData.endDateTime)
      validationErrors.endDateTime = "End Date is required";
    else if (new Date(formData.endDateTime) <= new Date(formData.startDateTime))
      validationErrors.endDateTime = "End Date must be later than Start Date";
    if (!formData.reason) validationErrors.reason = "Reason is required";
    else if (formData.reason.length > 1000)
      validationErrors.reason = "Reason cannot exceed 1000 characters";
    if (!formData.leaveType)
      validationErrors.leaveType = "Leave Type is required";

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {method === "POST" ? "Create Leave Request" : "Update Leave Request"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="startDateTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${
              errors.startDateTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startDateTime && (
            <p className="text-sm text-red-500 mt-1">{errors.startDateTime}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="endDateTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${
              errors.endDateTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endDateTime && (
            <p className="text-sm text-red-500 mt-1">{errors.endDateTime}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${
              errors.reason ? "border-red-500" : "border-gray-300"
            }`}
            rows="4"
          />
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1">{errors.reason}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="leaveType"
            className="block text-sm font-medium text-gray-700"
          >
            Leave Type
          </label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveTypeValue}
            onChange={handleChange}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${
              errors.leaveType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Leave Type</option>
            <option value="1">Maternity Leave</option>
            <option value="2">Paid Leave</option>
            <option value="3">Casual Leave</option>
            <option value="4">Sick Leave</option>
          </select>
          {errors.leaveType && (
            <p className="text-sm text-red-500 mt-1">{errors.leaveType}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          {method === "POST" ? "Submit Leave Request" : "Update Leave Request"}
        </button>
      </form>
    </div>
  );
};

LeaveForm.propTypes = {
  method: PropTypes.oneOf(["POST", "PUT"]).isRequired,
  initialData: PropTypes.shape({
    startDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    reason: PropTypes.string,
    leaveType: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default LeaveForm;
