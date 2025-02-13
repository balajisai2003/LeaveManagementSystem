import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState(""); 

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (!isAuthenticated) {
    return (
      <>
        <nav className="bg-gray-800 text-white p-4">
          <h1 className="text-3xl font-bold">Leave Management System</h1>
          <p className="mt-2">Please log in to access the system.</p>
        </nav>
        <main>
          <Outlet />
        </main>
      </>
    );
  }

  const renderQuickLinks = () => {
    if (role === "Admin") {
      if (activeSection === "User Management") {
        return (
          <>
            <Link to="/admin/users" className="text-white hover:underline">
              Manage Users
            </Link>
            <Link
              to="/admin/users/create"
              className="text-white hover:underline"
            >
              Create User
            </Link>
          </>
        );
      }
      if (activeSection === "Leave Management") {
        return (
          <>
            <Link to="/admin/leaves" className="text-white hover:underline">
              All Leaves
            </Link>
            <Link
              to="/admin/leaves/pending"
              className="text-white hover:underline"
            >
              Pending Leaves
            </Link>
            <Link
              to="/admin/leaves/approved"
              className="text-white hover:underline"
            >
              Approved Leaves
            </Link>
            <Link
              to="/admin/leaves/rejected"
              className="text-white hover:underline"
            >
              Rejected Leaves
            </Link>
          </>
        );
      }
    }

    if (role === "Manager") {
      if (activeSection === "Leave Management") {
        return (
          <>
            <Link to="/manager/leaves" className="text-white hover:underline">
              All Leaves
            </Link>
            <Link
              to="/manager/leaves/pending"
              className="text-white hover:underline"
            >
              Pending Leaves
            </Link>
            <Link
              to="/manager/leaves/approved"
              className="text-white hover:underline"
            >
              Approved Leaves
            </Link>
            <Link
              to="/manager/leaves/rejected"
              className="text-white hover:underline"
            >
              Rejected Leaves
            </Link>
          </>
        );
      }
      if (activeSection === "My Leaves") {
        return (
          <>
            <Link
              to="/manager/manager-leaves"
              className="text-white hover:underline"
            >
              My Leaves
            </Link>
            <Link
              to="/manager/manager-leaves/apply"
              className="text-white hover:underline"
            >
              Apply Leave
            </Link>
          </>
        );
      }
    }

    if (role === "Employee") {
      return (
        <>
          <Link
            to="/employee/employee-leaves"
            className="text-white hover:underline"
          >
            Leave Records
          </Link>
          <Link
            to="/employee/employee-leaves/apply"
            className="text-white hover:underline"
          >
            Apply Leave
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {role === "Admin" && "Admin Dashboard"}
            {role === "Manager" && "Manager Dashboard"}
            {role === "Employee" && "Employee Dashboard"}
          </h1>
          <div className="flex space-x-4">
            {role === "Admin" && (
              <>
                <button
                  onClick={() => setActiveSection("User Management")}
                  className={`px-3 py-2 rounded ${
                    activeSection === "User Management"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  } transition`}
                >
                  User Management
                </button>
                <button
                  onClick={() => setActiveSection("Leave Management")}
                  className={`px-3 py-2 rounded ${
                    activeSection === "Leave Management"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  } transition`}
                >
                  Leave Management
                </button>
              </>
            )}
            {role === "Manager" && (
              <>
                <button
                  onClick={() => setActiveSection("Leave Management")}
                  className={`px-3 py-2 rounded ${
                    activeSection === "Leave Management"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  } transition`}
                >
                  Leave Management
                </button>
                <button
                  onClick={() => setActiveSection("My Leaves")}
                  className={`px-3 py-2 rounded ${
                    activeSection === "My Leaves"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  } transition`}
                >
                  My Leaves
                </button>
              </>
            )}
            {role === "Employee" && (
              <div className="flex space-x-4">
                <Link
                  to="/employee/employee-leaves"
                  className="text-white hover:underline"
                >
                  Leave Records
                </Link>
                <Link
                  to="/employee/employee-leaves/apply"
                  className="text-white hover:underline"
                >
                  Apply Leave
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-lg">Welcome, {user.name}!</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mt-4 bg-gray-700 p-2 rounded">
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <div className="flex space-x-4 mt-2">{renderQuickLinks()}</div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
