import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetAllManagers,
  GetEmployeeById,
  UpdateEmployee,
} from "../../services/employeeService";
import UserForm from "../UI/UserForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState({
    email: "",
    role: "",
    managerId: "",
    name: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employeeResponse = await GetEmployeeById(userId);
        if (employeeResponse.isSuccess) {
          setInitialData({
            email: employeeResponse.data.email,
            role: employeeResponse.data.role,
            managerId: employeeResponse.data.managerId || "",
            name: employeeResponse.data.name,
          });
        } else {
          toast.error(
            employeeResponse.message || "Failed to fetch employee details."
          );
        }

        const managersResponse = await GetAllManagers();
        if (managersResponse.isSuccess) {
          setManagers(managersResponse.data);
        } else {
          toast.error(managersResponse.message || "Failed to fetch managers.");
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const onUpdate = async (data) => {
    try {
      const updateResponse = await UpdateEmployee(userId, data);
      if (updateResponse.isSuccess) {
        toast.success("User updated successfully!");
        navigate("/");
      } else {
        toast.error(
          updateResponse.message || "An error occurred while updating the user."
        );
      }
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
      toast.error("An error occurred while updating the user.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Update User</h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading managers...</div>
      ) : (
        <UserForm
          method="PUT"
          initialData={initialData}
          onSubmit={onUpdate}
          managers={managers}
        />
      )}
    </div>
  );
};

export default UpdateUser;
