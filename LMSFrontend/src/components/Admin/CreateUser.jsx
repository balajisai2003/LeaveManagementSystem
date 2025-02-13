import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { GetAllManagers, Register } from "../../services/employeeService";
import UserForm from "../UI/UserForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
  }, []);

  const onCreate = async (data) => {
    try {
      const response = await Register(data);
      if (response.isSuccess) {
        toast.success("User created successfully!");
        navigate('/')

      } else {
        toast.error(
          response.message || "An error occurred while creating user."
        );
      }
    } catch (error) {
      toast.error("An error occurred while creating user.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Create User</h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading managers...</div>
      ) : (
        <UserForm method="POST" onSubmit={onCreate} managers={managers} />
      )}
    </div>
  );
};

export default CreateUser;
