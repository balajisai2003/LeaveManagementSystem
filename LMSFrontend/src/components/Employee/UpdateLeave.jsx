import LeaveForm from "../UI/LeaveForm";
import { GetLeaveById } from "../../services/leaveService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UpdateLeave as UpdateLeaveDetails } from "../../services/leaveService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateLeave() {
  const { leaveId } = useParams();
  const [leaveData, setLeaveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await GetLeaveById(leaveId);
        if (response.isSuccess) {
          setLeaveData(response.data);
        } else {
          toast.error(response.message || "Failed to fetch leave details.");
          setError(response.message || "Failed to fetch leave details.");
        }
      } catch (error) {
        toast.error(
          "An error occurred while fetching leave data. Please try again."
        );
        setError(
          "An error occurred while fetching leave data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [leaveId]);

  if (loading) {
    return <div className="text-center mt-10">Loading leave details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  async function onSubmitLeave(updatedData) {
    updatedData.empId = user.id;
    updatedData.managerId = user.managerId;

    try {
      const response = await UpdateLeaveDetails(leaveId, updatedData);
      if (response.isSuccess) {
        toast.success(
          "Leave updated successfully! Redirecting to leave list..."
        );
        navigate("/employee/employee-leaves");
      } else {
        toast.error(
          response.message || "Failed to update leave. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred while updating leave. Please try again.");
    }
  }

  return (
    <>
      <LeaveForm
        method="PUT"
        initialData={leaveData}
        onSubmit={onSubmitLeave}
      />
    </>
  );
}
