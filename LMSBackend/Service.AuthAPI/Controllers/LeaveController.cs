using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.LMSApi.Models;
using Service.LMSApi.Models.Domains;
using Service.LMSApi.Services.IServices;

namespace Service.LMSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveService _leaveService;
        public LeaveController(ILeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        // GET: api/Leave/5
        [HttpGet("{empId}")]
        public async Task<ResponseDTO> GetAllLeavesByEmpIdAsync([FromRoute]int empId)
        {
            try
            {
                return await _leaveService.GetLeavesByEmpIdAsync(empId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }


        // GET: api/Leave/approval/5
        [HttpGet("approval/{managerId}")]
        public async Task<ResponseDTO> GetLeavesForApprovalAsync([FromRoute] int managerId)
        {
            try
            {
                return await _leaveService.GetLeavesForApprovalAsync(managerId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // POST: api/Leave
        [HttpPost]
        public async Task<ResponseDTO> ApplyLeaveAsync([FromBody]LeaveRequestDTO leaveRequest)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    return await _leaveService.ApplyLeaveAsync(leaveRequest);
                }
                catch (Exception ex)
                {
                    return new ResponseDTO
                    {
                        message = ex.Message,
                        isSuccess = false,
                        Data = null
                    };
                }
            }
            else
            {
                var errors = ModelState.Values
                               .SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                return new ResponseDTO
                {
                    message = string.Join("\n", errors),
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // PUT: api/Leave/5
        [HttpPut("Update/{id}")]
        public async Task<ResponseDTO> UpdateLeaveAsync([FromRoute]int id,[FromBody]LeaveRequestDTO leaveRequest)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    return await _leaveService.UpdateLeaveAsync(id,leaveRequest);
                }
                catch (Exception ex)
                {
                    return new ResponseDTO
                    {
                        message = ex.Message,
                        isSuccess = false,
                        Data = null
                    };
                }
            }
            else
            {
                var errors = ModelState.Values
                               .SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                return new ResponseDTO
                {
                    message = string.Join("\n", errors),
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // PATCH: api/Leave/approve/5/5
        [HttpPatch("approve/{leaveId}/{managerId}")]
        public async Task<ResponseDTO> ApproveLeaveAsync([FromRoute] int leaveId, [FromRoute] int managerId)
        {
            try
            {
                return await _leaveService.ApproveLeaveAsync(leaveId, managerId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // PATCH: api/Leave/reject/5/5
        [HttpPatch("reject/{leaveId}/{managerId}")]
        public async Task<ResponseDTO> RejectLeaveAsync([FromRoute] int leaveId, [FromRoute] int managerId)
        {
            try
            {
                return await _leaveService.RejectLeaveAsync(leaveId, managerId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // GET: api/Leave/details/5
        [HttpGet("details/{leaveId}")]
        public async Task<ResponseDTO> GetLeaveByIdAsync([FromRoute] int leaveId)
        {
            try
            {
                return await _leaveService.GetLeaveByIdAsync(leaveId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }

        // DELETE: api/Leave/cancel/5/5
        [HttpDelete("cancel/{leaveId}/{empId}")]
        public async Task<ResponseDTO> CancelLeaveAsync([FromRoute] int leaveId,[FromRoute] int empId)
        {
            try
            {
                return await _leaveService.CancelLeaveAsync(leaveId, empId);
            }
            catch (Exception ex)
            {
                return new ResponseDTO
                {
                    message = ex.Message,
                    isSuccess = false,
                    Data = null
                };
            }
        }


    }
}
