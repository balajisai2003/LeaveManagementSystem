import { Login as loginService } from "../../services/employeeService";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get("email");
    const password = fd.get("password");

    let validationErrors = {};
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const data = await loginService({ email, password });
      if (data.isSuccess) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.employee));
        toast.success("Login successful!");
        dispatch(login({ user: data.employee, role: data.employee.role }));
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
