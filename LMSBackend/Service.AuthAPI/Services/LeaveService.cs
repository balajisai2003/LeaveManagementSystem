using Microsoft.Data.SqlClient;
using Service.LMSApi.Models;
using Service.LMSApi.Models.Domains;
using Service.LMSApi.Services.IServices;
using Service.LMSApi.Utils;
using System.Data;

namespace Service.LMSApi.Services
{
    public class LeaveService : ILeaveService
    {
        private const string ConnectionString = "Data Source=DESKTOP-ND6SQ79\\SQLEXPRESS;Initial Catalog=LMSPortal;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=True";
        private const string PendingStatus = "Pending";
        private const string ManagerRole = "Manager";

        // Apply for leave
        public async Task<ResponseDTO> ApplyLeaveAsync(LeaveRequestDTO leaveRequest)
        {
            return await ExecuteInConnection(async connection =>
            {
                if (!await CheckEmployeeExistsAsync(connection, leaveRequest.EmpId))
                    return CreateResponse(false, "Employee not found.");

                if (!await CheckManagerIsValidAsync(connection, leaveRequest.ManagerId))
                    return CreateResponse(false, "Manager not found.");

                if (await CheckOverlappingLeavesAsync(connection, leaveRequest))
                    return CreateResponse(false, "Leave request overlaps with existing leave.");

                var query = @"
                    INSERT INTO LeaveRequest (EmpId, ManagerId, StartDateTime, EndDateTime, Reason, LeaveType, ReqStatus)
                    VALUES (@EmpId, @ManagerId, @StartDateTime, @EndDateTime, @Reason, @LeaveType, @ReqStatus)";
                await ExecuteCommandAsync(connection, query, new SqlParameter[]
                {
                    new SqlParameter("@EmpId", leaveRequest.EmpId),
                    new SqlParameter("@ManagerId", leaveRequest.ManagerId),
                    new SqlParameter("@StartDateTime", leaveRequest.StartDateTime),
                    new SqlParameter("@EndDateTime", leaveRequest.EndDateTime),
                    new SqlParameter("@Reason", leaveRequest.Reason),
                    new SqlParameter("@LeaveType", MapLeaveType(leaveRequest.LeaveType)),
                    new SqlParameter("@ReqStatus", PendingStatus)
                });

                return CreateResponse(true, "Leave request submitted successfully.");
            });
        }

        // Update leave request
        public async Task<ResponseDTO> UpdateLeaveAsync(int leaveRequestId, LeaveRequestDTO leaveRequest)
        {
            return await ExecuteInConnection(async connection =>
            {
                var resp = await GetLeaveByIdAsync(leaveRequestId);
                if (resp == null)
                {
                    return CreateResponse(false, "Leave not found");
                }
                if (!await CheckEmployeeExistsAsync(connection, leaveRequest.EmpId))
                    return CreateResponse(false, "Employee not found.");

                if (!await CheckManagerIsValidAsync(connection, leaveRequest.ManagerId))
                    return CreateResponse(false, "Manager not found.");

                if (await CheckOverlappingLeavesAsync(connection, leaveRequest))
                    return CreateResponse(false, "Leave request overlaps with existing leave.");

                const string query = @"
                    UPDATE LeaveRequest
                    SET StartDateTime = @StartDateTime, EndDateTime = @EndDateTime,
                        Reason = @Reason, LeaveType = @LeaveType
                    WHERE Id = @LeaveRequestId";
                await ExecuteCommandAsync(connection, query, new SqlParameter[]
                {
                   
                    new SqlParameter("@StartDateTime", leaveRequest.StartDateTime),
                    new SqlParameter("@EndDateTime", leaveRequest.EndDateTime),
                    new SqlParameter("@Reason", leaveRequest.Reason),
                    new SqlParameter("@LeaveType", MapLeaveType(leaveRequest.LeaveType)),
                    new SqlParameter("@LeaveRequestId", leaveRequestId)
                });

                return CreateResponse(true, "Leave request updated successfully.");
            });
        }

        // Get all leaves by employee ID
        public async Task<ResponseDTO> GetLeavesByEmpIdAsync(int empId)
        {
            return await ExecuteInConnection(async connection =>
            {
                if (!await CheckEmployeeExistsAsync(connection, empId))
                    return CreateResponse(false, "Employee not found.");
                const string query = "SELECT * FROM LeaveRequest WHERE EmpId = @EmpId";
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@EmpId", empId);
                using var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                var leaveRequests = new List<LeaveRequest>();
                while (await reader.ReadAsync())
                {
                    leaveRequests.Add(new LeaveRequest
                    {
                        Id = reader.GetInt32(0),
                        EmpId = reader.GetInt32(1),
                        ManagerId = reader.GetInt32(2),
                        StartDateTime = reader.GetDateTime(3),
                        EndDateTime = reader.GetDateTime(4),
                        Reason = reader.GetString(5),
                        LeaveType = reader.GetString(6),
                        ReqStatus = reader.GetString(7)
                    });
                }
                return CreateResponse(true, "Leaves retrieved successfully.", leaveRequests);
            });
        }

        // Get all leaves for approval by manager ID
        public async Task<ResponseDTO> GetLeavesForApprovalAsync(int managerId)
        {
            return await ExecuteInConnection(async connection =>
            {
                if (!await CheckManagerIsValidAsync(connection, managerId))
                    return CreateResponse(false, "Manager not found.");
                const string query = "SELECT * FROM LeaveRequest WHERE ManagerId = @ManagerId AND ReqStatus = @PendingStatus";
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@ManagerId", managerId);
                command.Parameters.AddWithValue("@PendingStatus", PendingStatus);
                using var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                var leaveRequests = new List<LeaveRequest>();
                while (await reader.ReadAsync())
                {
                    leaveRequests.Add(new LeaveRequest
                    {
                        Id = reader.GetInt32(0),
                        EmpId = reader.GetInt32(1),
                        ManagerId = reader.GetInt32(2),
                        StartDateTime = reader.GetDateTime(3),
                        EndDateTime = reader.GetDateTime(4),
                        Reason = reader.GetString(5),
                        LeaveType = reader.GetString(6),
                        ReqStatus = reader.GetString(7)
                    });
                }
                return CreateResponse(true, "Leaves retrieved successfully.", leaveRequests);
            });
        }

        // Approve leave request
        public async Task<ResponseDTO> ApproveLeaveAsync(int leaveRequestId, int managerId)
        {
            var leaveRequest = await GetLeaveByIdAsync(leaveRequestId);
       
            if (!leaveRequest.isSuccess)
                return leaveRequest;
           
            var leave = (LeaveRequest)leaveRequest.Data;
            if (leave.ManagerId != managerId)
                return CreateResponse(false, "You are not authorized to approve this leave request.");
            return await ExecuteInConnection(async connection =>
            {
                if (await CheckOverlappingLeavesAsync(connection, new LeaveRequestDTO { EmpId = leave.EmpId, ManagerId = leave.ManagerId, StartDateTime = leave.StartDateTime, EndDateTime = leave.EndDateTime , LeaveType = 1, Reason = leave.Reason }))
                    return CreateResponse(false, "Leave request overlaps with existing leave.");
                const string query = "UPDATE LeaveRequest SET ReqStatus = @ApprovedStatus WHERE Id = @LeaveRequestId";
                await ExecuteCommandAsync(connection, query, new SqlParameter[]
                {
                    new SqlParameter("@ApprovedStatus", "Approved"),
                    new SqlParameter("@LeaveRequestId", leaveRequestId)
                });
                return CreateResponse(true, "Leave request approved successfully.");
            });
        }

        // Reject leave request
        public async Task<ResponseDTO> RejectLeaveAsync(int leaveRequestId, int managerId)
        {
            var leaveRequest = await GetLeaveByIdAsync(leaveRequestId);
            if (!leaveRequest.isSuccess)
                return leaveRequest;
            var leave = (LeaveRequest)leaveRequest.Data;
            if (leave.ManagerId != managerId)
                return CreateResponse(false, "You are not authorized to reject this leave request.");
            return await ExecuteInConnection(async connection =>
            {
                const string query = "UPDATE LeaveRequest SET ReqStatus = @RejectedStatus WHERE Id = @LeaveRequestId";
                await ExecuteCommandAsync(connection, query, new SqlParameter[]
                {
                 new SqlParameter("@RejectedStatus", "Rejected"),
                 new SqlParameter("@LeaveRequestId", leaveRequestId)
                });
                return CreateResponse(true, "Leave request rejected successfully.");
            });
        }

        // Get leave request by ID
        public async Task<ResponseDTO> GetLeaveByIdAsync(int leaveRequestId)
        {
            return await ExecuteInConnection(async connection =>
            {
                const string query = "SELECT * FROM LeaveRequest WHERE Id = @LeaveRequestId";
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@LeaveRequestId", leaveRequestId);
                using var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);
                if (!await reader.ReadAsync())
                    return CreateResponse(false, "Leave request not found.");
                var leaveRequest = new LeaveRequest
                {
                    Id = reader.GetInt32(0),
                    EmpId = reader.GetInt32(1),
                    ManagerId = reader.GetInt32(2),
                    StartDateTime = reader.GetDateTime(3),
                    EndDateTime = reader.GetDateTime(4),
                    Reason = reader.GetString(5),
                    LeaveType = reader.GetString(6),
                    ReqStatus = reader.GetString(7)
                };
                return CreateResponse(true, "Leave request retrieved successfully.", leaveRequest);
            });
        }

        // Delete leave request
        public async Task<ResponseDTO> CancelLeaveAsync(int leaveRequestId, int empId)
        {
            var leaveRequest = await GetLeaveByIdAsync(leaveRequestId);
            if (!leaveRequest.isSuccess)
                return leaveRequest;
            var leave = (LeaveRequest)leaveRequest.Data;
            if (leave.EmpId != empId)
                return CreateResponse(false, "You are not authorized to cancel this leave request.");
            return await ExecuteInConnection(async connection =>
            {
                const string query = "DELETE FROM LeaveRequest WHERE Id = @LeaveRequestId";
                await ExecuteCommandAsync(connection, query, new SqlParameter[]
                {
                    new SqlParameter("@LeaveRequestId", leaveRequestId)
                });
                return CreateResponse(true, "Leave request cancelled successfully.");
            });
        }
        // Common connection executor
        private async Task<ResponseDTO> ExecuteInConnection(Func<SqlConnection, Task<ResponseDTO>> action)
        {
            await using var connection = new SqlConnection(ConnectionString);
            await connection.OpenAsync();
            return await action(connection);
        }

        // Helper: Standardized response creation
        private ResponseDTO CreateResponse(bool isSuccess, string message, object data = null)
        {
            return new ResponseDTO { isSuccess = isSuccess, message = message, Data = data };
        }

        // Helper: Execute commands
        private async Task ExecuteCommandAsync(SqlConnection connection, string query, SqlParameter[] parameters)
        {
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddRange(parameters);
            await command.ExecuteNonQueryAsync();
        }

        // Employee existence check
        private async Task<bool> CheckEmployeeExistsAsync(SqlConnection connection, int empId)
        {
            const string query = "SELECT COUNT(1) FROM Employee WHERE Id = @EmpId";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@EmpId", empId);
            return (int)await command.ExecuteScalarAsync() > 0;
        }

        // Manager validity check
        private async Task<bool> CheckManagerIsValidAsync(SqlConnection connection, int managerId)
        {
            const string query = "SELECT Role FROM Employee WHERE Id = @ManagerId";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@ManagerId", managerId);
            var role = (string)await command.ExecuteScalarAsync();
            return role == ManagerRole;
        }

        // Overlapping leaves check
        private async Task<bool> CheckOverlappingLeavesAsync(SqlConnection connection, LeaveRequestDTO leaveRequest)
        {
            const string query = @"
                SELECT COUNT(1)
                FROM LeaveRequest
                WHERE EmpId = @EmpId AND ReqStatus = @ApprovedStatus
                  AND StartDateTime <= @EndDateTime AND EndDateTime >= @StartDateTime";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@EmpId", leaveRequest.EmpId);
            command.Parameters.AddWithValue("@ApprovedStatus", "Approved");
            command.Parameters.AddWithValue("@StartDateTime", leaveRequest.StartDateTime);
            command.Parameters.AddWithValue("@EndDateTime", leaveRequest.EndDateTime);
            return (int)await command.ExecuteScalarAsync() > 0;
        }

        // Map leave type
        private string MapLeaveType(int leaveType)
        {
            return leaveType switch
            {
                1 => "Maternity Leave",
                2 => "Paid Leave",
                3 => "Casual Leave",
                4 => "Sick Leave",
                _ => "Casual Leave"
            };
        }
    }
}



//{
//    "id": 11,
//      "name": "rana",
//      "email": "rana@example.com",
//      "managerId": 2,
//      "role": "Employee",
//      "password": "123456789"
//    }

//{
//    "id": 5,
//      "empId": 11,
//      "managerId": 2,
//      "startDateTime": "2024-12-05T08:44:07.747",
//      "endDateTime": "2024-12-08T08:44:07.747",
//      "reason": "string",
//      "reqStatus": "Sick Leave",
//      "leaveType": "Pending"
//    }
