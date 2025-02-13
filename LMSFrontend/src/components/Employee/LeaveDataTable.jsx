// Employee Leave Data Table
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { GetAllLeavesByEmpId, CancelLeave } from "../../services/leaveService";
import { GetAllManagers } from "../../services/employeeService";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../UI/DeleteConfirmationDialog";
import { toast } from "react-toastify";
import LeaveFilters from "../UI/LeaveFilters";

export default function LeaveDataTable() {
  const user = useSelector((state) => state.auth.user);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await GetAllLeavesByEmpId(user.id);
        if (response.isSuccess) {
          setLeaves(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
      try {
        const { isSuccess, data, message } = await GetAllManagers();
        if (isSuccess) {
          setManagers(data);
        } else {
          toast.error(message || "Failed to fetch managers.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const ManagerName = user.managerId
    ? managers.find((manager) => manager.id === user.managerId)?.name ||
      "Unknown Manager"
    : "No Manager Assigned";

  const handleDelete = (row) => {
    setLeaveToDelete(row);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!leaveToDelete) return;

    try {
      const response = await CancelLeave(leaveToDelete.id, user.id);
      if (response.isSuccess) {
        toast.success("Leave cancelled successfully!");
        setLeaves((prevLeaves) =>
          prevLeaves.filter((leave) => leave.id !== leaveToDelete.id)
        );
      } else {
        toast.error(response.message || "Failed to cancel leave.");
      }
    } catch {
      toast.error("An error occurred while cancelling leave.");
    } finally {
      setShowDialog(false);
      setLeaveToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setLeaveToDelete(null);
  };

  const columns = [
    {
      name: "Leave ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      name: "Start Date & Time",
      selector: (row) =>
        format(new Date(row.startDateTime), "MMM dd, yyyy, hh:mm a"),
      sortable: true,
      cell: (row) => (
        <span>
          {format(new Date(row.startDateTime), "MMM dd, yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      name: "End Date & Time",
      selector: (row) =>
        format(new Date(row.endDateTime), "MMM dd, yyyy, hh:mm a"),
      sortable: true,
      cell: (row) => (
        <span>
          {format(new Date(row.endDateTime), "MMM dd, yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
      wrap: true,
      cell: (row) => <span className="truncate w-48">{row.reason}</span>,
    },
    {
      name: "Request Status",
      selector: (row) => row.reqStatus,
      cell: (row) => (
        <span
          className={`font-semibold ${
            row.reqStatus === "Pending"
              ? "text-yellow-500"
              : row.reqStatus === "Rejected"
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {row.reqStatus}
        </span>
      ),
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
      cell: (row) => <span className="font-medium">{row.leaveType}</span>,
    },
    {
      name: "Actions / Info",
      cell: (row) => {
        if (row.reqStatus === "Pending") {
          return (
            <div className="flex space-x-2">
              <Link to={row.id + "/update"}>
                <button className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600 transition">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(row)}
                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          );
        } else if (row.reqStatus === "Rejected") {
          return (
            <span className="text-red-500">
              Rejected Reason: {row.rejectedReason || "Not provided"}
            </span>
          );
        }
        return <span className="text-gray-400">No Actions</span>;
      },
    },
  ];

  const filteredLeaves = leaves.filter((leave) => {
    const isMatchingSearch =
      leave.id.toString().includes(searchQuery) ||
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase());

    const isWithinDateRange =
      (startDate
        ? new Date(leave.startDateTime) >= new Date(startDate)
        : true) &&
      (endDate ? new Date(leave.endDateTime) <= new Date(endDate) : true);

    return isMatchingSearch && isWithinDateRange;
  });

  const pastLeaves = filteredLeaves.filter(
    (leave) =>
      leave.reqStatus === "Approved" &&
      new Date(leave.startDateTime) < new Date()
  );
  const upcomingApprovedLeaves = filteredLeaves.filter(
    (leave) =>
      leave.reqStatus === "Approved" &&
      new Date(leave.startDateTime) > new Date()
  );
  const allLeaves = filteredLeaves;

  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Leave Records</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Manager: {user.managerId === 1 ? "Admin" : ManagerName}
      </h2>

      <LeaveFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        resetFilters={resetFilters}
      />

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <>
          {upcomingApprovedLeaves.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Upcoming Approved Leaves
              </h2>
              <DataTable
                columns={columns}
                data={upcomingApprovedLeaves}
                pagination
                className="shadow-lg rounded-lg bg-white"
                highlightOnHover
              />
            </div>
          )}

          {pastLeaves.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Past Approved Leaves
              </h2>
              <DataTable
                columns={columns}
                data={pastLeaves}
                pagination
                className="shadow-lg rounded-lg bg-white"
                highlightOnHover
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              All Leaves
            </h2>
            <DataTable
              columns={columns}
              data={allLeaves}
              pagination
              className="shadow-lg rounded-lg bg-white"
              highlightOnHover
            />
          </div>
        </>
      )}

      {showDialog && leaveToDelete && (
        <ConfirmationDialog
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message={`Are you sure you want to cancel the leave with ID ${leaveToDelete.id}?`}
        />
      )}
    </div>
  );
}
