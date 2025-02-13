# Leave Management System

## Introduction

### Project Name:
Leave Management System

### Purpose:
The Leave Management System is designed to streamline the leave application, approval, and management process for employees, managers, and administrators, ensuring efficient handling of leave requests while maintaining role-based functionality.

### Overview:
- Employees can apply for leave, edit or cancel pending leave requests, and view their leave status.
- Managers can approve or reject leave requests with reasons while also applying for their own leaves, which are approved by administrators.
- Administrators oversee user account management, approve manager leaves, and ensure overall system functionality.

## Features

### For Employees:
- Apply for leave with specified leave types (Maternity, Paid, Casual, Sick).
- Edit or cancel pending leave requests.
- View leave status.

### For Managers:
- Approve or reject leave requests with reasons.
- Ensure no overlapping leave approvals for subordinates.
- Apply for their own leaves, approved by administrators.
- View all leave requests from their team.

### For Administrators:
- Create and manage employees and managers.
- Approve leave requests from managers.
- Ensure managers with active subordinates cannot be deleted.

## System Architecture

### Roles and Permissions:
- **Employee:** Apply, edit, delete pending leave requests.
- **Manager:** Approve/reject leave requests, manage team leaves, and apply for leave.
- **Admin:** Manage user creation, updates, and leave approvals for managers.

### Technologies Used:
- **Frontend:** ReactJS
- **Backend:** ASP.NET Core WebAPI
- **Database:** Microsoft SQL Server
- **Authentication:** JWT-based authorization with claims for role and user ID validation.

## Setup Guide

### Prerequisites
Ensure you have the following installed:
- **Node.js** (for frontend)
- **.NET SDK** (for backend)
- **Microsoft SQL Server**
- **Git**

### Installation & Setup

#### Clone the Repository:
```sh
git clone https://github.com/balajisai2003/LeaveManagementSystem.git
cd LeaveManagementSystem
```

### Backend Setup

#### Navigate to Backend Directory:
```sh
cd LMSBackend
```

#### Restore Dependencies:
```sh
dotnet restore
```

#### Database Setup:
1. Update `appsettings.json` with your SQL Server connection string.
2. Apply migrations:
   ```sh
   dotnet ef database update
   ```

#### Run the Backend:
```sh
dotnet run --project LMSBackend/LMSBackend.csproj
```

### Frontend Setup

#### Navigate to Frontend Directory:
```sh
cd LMSFrontend
```

#### Install Dependencies:
```sh
npm install
```

#### Start the Frontend:
```sh
npm start
```

## API Endpoints

### **EmployeeController**
| HTTP Method | Endpoint | Description | Access |
|------------|---------|-------------|--------|
| POST | `/api/Employee/Register` | Register a new employee/manager | Admin |
| POST | `/api/Employee/Login` | Authenticate a user | Anonymous |
| PUT | `/api/Employee/Update/{id}` | Update employee details | Admin |
| DELETE | `/api/Employee/Delete/{id}` | Delete an employee | Admin |
| GET | `/api/Employee/GetEmployeeById/{id}` | Get employee details by ID | Admin |
| GET | `/api/Employee/GetAllEmployees` | Get a list of all employees | Admin |
| GET | `/api/Employee/GetAllManagers` | Get a list of all managers | Anonymous |

### **LeaveController**
| HTTP Method | Endpoint | Description | Access |
|------------|---------|-------------|--------|
| GET | `/api/Leave/{empId}` | Get all leave requests by employee ID | Authorized |
| GET | `/api/Leave/manager/leaves/{managerId}` | Get all leave requests of a manager’s team | Manager |
| POST | `/api/Leave` | Apply for a leave | Employee |
| PUT | `/api/Leave/Update/{id}` | Update a leave request | Employee |
| PATCH | `/api/Leave/manager/approve/{leaveId}/{managerId}` | Approve a leave request | Manager |
| PATCH | `/api/Leave/manager/reject/{leaveId}/{managerId}` | Reject a leave request with reason | Manager |
| GET | `/api/Leave/details/{leaveId}` | Get leave details by ID | Authorized |
| DELETE | `/api/Leave/cancel/{leaveId}/{empId}` | Cancel a leave request | Employee |

## Usage Guide

### Employees:
- Log in to apply, view, edit, or cancel leave requests.

### Managers:
- Log in to manage team leave requests and apply for their own leave.

### Admins:
- Log in to manage user accounts and approve manager leave requests.

---
