// Manager Leave Data Table
import {
  GetLeavesAssignedToManager,
  ApproveLeave,
  RejectLeave,
} from "../../services/leaveService";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../UI/LeaveConfirmationDialog";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaveFilters from "../UI/LeaveFilters";

export default function LeaveDataTable({ type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogConfig, setDialogConfig] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState(""); 
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaveData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetLeavesAssignedToManager(userId);
        if (response.isSuccess && isMounted) {
          setData(response.data);
        } else if (isMounted) {
          const errorMessage = response.message || "Failed to fetch leave data";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            "An unexpected error occurred while fetching leave data.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLeaveData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleActionClick = (actionType, leaveId) => {
    if (actionType && leaveId) {
      setDialogConfig({ actionType, leaveId });
    } else {
      console.warn("Action type or leave ID is undefined:", {
        actionType,
        leaveId,
      });
    }
  };

  const handleActionConfirm = async (reason) => {
    if (!dialogConfig) {
      console.error("Dialog config is not defined when confirming action.");
      return;
    }

    let response;
    try {
      if (dialogConfig.actionType === "Approve") {
        response = await ApproveLeave(dialogConfig.leaveId, userId);
      } else if (dialogConfig.actionType === "Reject") {
        response = await RejectLeave(dialogConfig.leaveId, userId, reason);
      }

      if (response.isSuccess) {
        setData((prevData) =>
          prevData.map((leave) =>
            leave.id === dialogConfig.leaveId
              ? {
                  ...leave,
                  reqStatus:
                    dialogConfig.actionType === "Approve"
                      ? "Approved"
                      : "Rejected",
                  ...(dialogConfig.actionType === "Reject" && {
                    rejectedReason: reason,
                  }),
                }
              : leave
          )
        );
        toast.success(
          `Leave ${dialogConfig.actionType.toLowerCase()}ed successfully!`
        );
      } else {
        const errorMessage = response.message || "Failed to perform the action";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        "An error occurred while processing the leave request.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
    setDialogConfig(null);
  };

  const columns = [
    {
      name: "Emp ID",
      selector: (row) => row.empId,
      sortable: true,
    },
    {
      name: "Start Date & Time",
      selector: (row) =>
        new Date(row.startDateTime).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "End Date & Time",
      selector: (row) =>
        new Date(row.endDateTime).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`inline-block px-2 py-1 rounded ${
            {
              Pending: "bg-yellow-100 text-yellow-800",
              Approved: "bg-green-100 text-green-800",
              Rejected: "bg-red-100 text-red-800",
            }[row.reqStatus] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.reqStatus}
        </span>
      ),
      sortable: true,
    },
    ...(type === "pending leaves" || type === "all leaves"
      ? [
          {
            name: "Actions",
            cell: (row) => (
              <div className="flex flex-col gap-1 m-1">
                {row.reqStatus === "Pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleActionClick("Approve", row.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleActionClick("Reject", row.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {row.reqStatus === "Approved" && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleActionClick("Reject", row.id)}
                  >
                    Reject
                  </button>
                )}
                {row.reqStatus === "Rejected" && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleActionClick("Approve", row.id)}
                  >
                    Approve
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
    ...(type === "rejected leaves"
      ? [
          {
            name: "Rejected Reason",
            selector: (row) => row.rejectedReason || "N/A",
            sortable: true,
            wrap: true,
          },
        ]
      : []),
  ];

  const tableData = (() => {
    let filteredData = data;

    if (startDate) {
      filteredData = filteredData.filter(
        (leave) => new Date(leave.startDateTime) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(
        (leave) => new Date(leave.endDateTime) <= new Date(endDate)
      );
    }

    if (searchText) {
      filteredData = filteredData.filter(
        (leave) =>
          leave.empId.toString().includes(searchText) ||
          leave.reason.toLowerCase().includes(searchText.toLowerCase()) ||
          leave.leaveType.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    switch (type) {
      case "pending leaves":
        return filteredData.filter((leave) => leave.reqStatus === "Pending");
      case "approved leaves":
        return filteredData.filter((leave) => leave.reqStatus === "Approved");
      case "rejected leaves":
        return filteredData.filter((leave) => leave.reqStatus === "Rejected");
      default:
        return filteredData;
    }
  })();

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchText(""); 
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Leave Details</h1>

      <LeaveFilters
        searchQuery={searchText}
        setSearchQuery={setSearchText}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        resetFilters={handleResetFilters}
      />

      

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}
      {!loading && <DataTable columns={columns} data={tableData} pagination />}
      {dialogConfig && (
        <ConfirmationDialog
          actionType={dialogConfig.actionType}
          onConfirm={handleActionConfirm}
          onCancel={() => setDialogConfig(null)}
        />
      )}
    </div>
  );
}
