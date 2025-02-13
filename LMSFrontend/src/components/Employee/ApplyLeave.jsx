import LeaveForm from "../UI/LeaveForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ApplyLeave as ApplyLeaveDetails } from "../../services/leaveService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitLeave = async (data) => {
    setLoading(true);
    setError("");

    try {
      data.empId = user.id;
      data.managerId = user.managerId;

      const response = await ApplyLeaveDetails(data);

      if (response.isSuccess) {
        toast.success("Leave applied successfully!");
        navigate("/employee/employee-leaves");
      } else {
        toast.error(
          response.message || "Failed to apply leave. Please try again."
        );
        setError(
          response.message || "Failed to apply leave. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred while applying leave. Please try again.");
      setError("An error occurred while applying leave. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">Processing your leave request...</div>
    );
  }

  return (
    <>
      {error && <div className="text-red-500 text-center mt-10">{error}</div>}
      <LeaveForm method="POST" onSubmit={onSubmitLeave} />
    </>
  );
}
