import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  GetAllEmployees,
  DeleteEmployee,
} from "../../services/employeeService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../UI/DeleteConfirmationDialog";

const columns = (handleDelete) => [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Role",
    selector: (row) => row.role,
    sortable: true,
  },
  {
    name: "Manager ID",
    selector: (row) => row.managerId,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex space-x-2">
        <Link to={`${row.id}/update`}>
          <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
            Edit
          </button>
        </Link>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      </div>
    ),
  },
];

export default function UserDataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAllEmployees();
        if (response.isSuccess) {
          const filteredData = response.data.filter(
            (emp) => emp.role !== "admin"
          );
          setData(filteredData);
        } else {
          toast.error(response.message || "Failed to fetch employees.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function handleDelete(id) {
    setSelectedId(id);
    setShowConfirmation(true);
  }

  const confirmDelete = async () => {
    setShowConfirmation(false);
    try {
      const response = await DeleteEmployee(selectedId);
      if (response.isSuccess) {
        toast.success("Employee deleted successfully.");
        const updatedResponse = await GetAllEmployees();
        if (updatedResponse.isSuccess) {
          const filteredData = updatedResponse.data.filter(
            (emp) => emp.role !== "admin"
          );
          setData(filteredData);
        }
      } else {
        toast.error(response.message || "Failed to delete employee.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the employee.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setSelectedId(null);
  };

  const filteredData = data.filter(
    (emp) =>
      (emp.id && emp.id.toString().includes(searchQuery)) || // Search by employee ID
      (emp.name &&
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())) || // Search by name
      (emp.email &&
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())) || // Search by email
      (emp.managerId && emp.managerId.toString().includes(searchQuery)) // Search by manager ID
  );

  const groupedData = filteredData.reduce((acc, emp) => {
    if (!acc[emp.role]) {
      acc[emp.role] = [];
    }
    acc[emp.role].push(emp);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Employee Details
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID, name, email, or manager ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        Object.keys(groupedData).map((role) => {
          if (role !== "Admin") {
            return (
              <div key={role} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700">
                  {role} Details
                </h2>
                <DataTable
                  columns={columns(handleDelete)}
                  data={groupedData[role]}
                  progressPending={loading}
                  pagination
                  highlightOnHover
                  striped
                  className="shadow-sm border rounded-lg mt-4"
                />
              </div>
            );
          }
          return null;
        })
      )}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this employee?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
