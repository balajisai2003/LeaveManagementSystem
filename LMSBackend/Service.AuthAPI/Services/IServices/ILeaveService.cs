using Service.LMSApi.Models;
using Service.LMSApi.Models.Domains;

namespace Service.LMSApi.Services.IServices
{
    public interface ILeaveService
    {
        Task<ResponseDTO> ApplyLeaveAsync(LeaveRequestDTO leaveRequest);
        Task<ResponseDTO> UpdateLeaveAsync(int id, LeaveRequestDTO leaveRequest);
        Task<ResponseDTO> GetLeavesByEmpIdAsync(int empId);
        Task<ResponseDTO> GetLeavesForApprovalAsync(int managerId);
        Task<ResponseDTO> ApproveLeaveAsync(int leaveId, int managerId);
        Task<ResponseDTO> RejectLeaveAsync(int leaveId, int managerId);
        Task<ResponseDTO> GetLeaveByIdAsync(int leaveId);
        Task<ResponseDTO> CancelLeaveAsync(int leaveId, int empId);
    }
}
