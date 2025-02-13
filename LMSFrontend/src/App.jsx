import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";
import { ToastContainer } from "react-toastify";

import SignIn from "./components/Auth/SignIn";
import CreateUser from "./components/Admin/CreateUser";
import UpdateUser from "./components/Admin/UpdateUser";
import UserDataTable from "./components/Admin/UsersDataTable";
import EmpLeaveData from "./components/Employee/LeaveDataTable";
import ApplyLeave from "./components/Employee/ApplyLeave";
import UpdateLeave from "./components/Employee/UpdateLeave";
import ManagerLeaveData from "./components/Manager/LeaveDataTable";
import NotFound from "./components/UI/NotFound";
import ErrorPage from "./components/UI/ErrorPage";
import NotAuthorized from "./components/Auth/NotAuthorised";
import Navbar from "./components/UI/Navbar";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: (
        <ErrorPage
          title="Error"
          message="Some Error Occurred"
          type="error"
          className="bg-red-100 text-red-600 p-4 rounded"
        />
      ),
      children: [
        {
          index: true,
          element: !isAuthenticated ? (
            <SignIn className="min-h-screen flex items-center justify-center" />
          ) : (
            <Navigate to={`/${role.toLowerCase()}`} />
          ),
        },
        {
          path: "admin",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {role === "Admin" ? <Outlet /> : <NotAuthorized />}
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="users" /> },
            { path: "users", element: <UserDataTable /> },
            { path: "users/create", element: <CreateUser /> },
            { path: "users/:userId/update", element: <UpdateUser /> },
            { path: "leaves", element: <ManagerLeaveData type="all leaves" /> },
            {
              path: "leaves/pending",
              element: <ManagerLeaveData type="pending leaves" />,
            },
            {
              path: "leaves/approved",
              element: <ManagerLeaveData type="approved leaves" />,
            },
            {
              path: "leaves/rejected",
              element: <ManagerLeaveData type="rejected leaves" />,
            },
          ],
        },
        {
          path: "manager",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {role === "Manager" || role === "Admin" ? (
                <Outlet />
              ) : (
                <NotAuthorized />
              )}
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="leaves" /> },
            { path: "leaves", element: <ManagerLeaveData type="all leaves" /> },
            {
              path: "leaves/pending",
              element: <ManagerLeaveData type="pending leaves" />,
            },
            {
              path: "leaves/approved",
              element: <ManagerLeaveData type="approved leaves" />,
            },
            {
              path: "leaves/rejected",
              element: <ManagerLeaveData type="rejected leaves" />,
            },
            { path: "manager-leaves", element: <EmpLeaveData /> },
            { path: "manager-leaves/apply", element: <ApplyLeave /> },
            {
              path: "manager-leaves/:leaveId/update",
              element: <UpdateLeave />,
            },
          ],
        },
        {
          path: "employee",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {role === "Employee" || role === "Manager" || role === "Admin" ? (
                <Outlet />
              ) : (
                <NotAuthorized />
              )}
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="employee-leaves" /> },
            { path: "employee-leaves", element: <EmpLeaveData /> },
            { path: "employee-leaves/apply", element: <ApplyLeave /> },
            {
              path: "employee-leaves/:leaveId/update",
              element: <UpdateLeave />,
            },
          ],
        },
        {
          path: "not-authorized",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NotAuthorized />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NotFound className="text-center text-gray-700 p-6" />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer className="toast-container" />
    </>
  );
};

export default App;
