using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.LMSApi.Models;
using Service.LMSApi.Services.IServices;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Service.LMSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        public IEmployeeServices _employeeServices { get; set; }
        public ResponseDTO _responseDTO { get; set; }
        public EmployeeController( IEmployeeServices employeeServices) 
        {
            _employeeServices = employeeServices;
            _responseDTO = new ResponseDTO();
        }

        [HttpPost]
        [Route("Register")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> RegisterAsync([FromBody] EmpRequestDTO request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    return await _employeeServices.RegisterAsync(request);
                }
                catch (Exception ex)
                {
                    _responseDTO.Data = null;
                    _responseDTO.isSuccess = false;
                    _responseDTO.message = ex.Message;
                }
            }
            else {

                var errors = ModelState.Values
                               .SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = string.Join("\n", errors);
            }
            return _responseDTO;

        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<LoginResponseDTO> LoginAsync([FromBody] LoginRequestDTO request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    return await _employeeServices.LoginAsync(request);
                }
                catch (Exception ex)
                {
                    new LoginResponseDTO
                    {
                        isSuccess = false,
                        message = ex.Message,
                        employee = null,
                        Token = null
                    };
                }
            }
            else
            {
                var errors = ModelState.Values
                               .SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                return new LoginResponseDTO
                {
                    employee = null,
                    Token = null,
                    isSuccess = false,
                    message = string.Join("\n", errors)
                };

            }

            return new LoginResponseDTO
            {
                employee = null,
                Token = null,
                isSuccess = false,
                message = "Invalid Request"
            };

        }

        [HttpPut]
        [Route("Update/{id}")]
        [Authorize(Roles= "Admin")]
        public async Task<ResponseDTO> UpdateAsync([FromRoute] int id, [FromBody] EmpRequestDTO request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    return await _employeeServices.UpdateAsync(id, request);
                }
                catch (Exception ex)
                {
                    _responseDTO.Data = null;
                    _responseDTO.isSuccess = false;
                    _responseDTO.message = ex.Message;
                }
            }
            else
            {
                var errors = ModelState.Values
                               .SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = string.Join("\n", errors);
            }
            return _responseDTO;
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> DeleteAsync([FromRoute] int id)
        {
            try
            {
                return await _employeeServices.DeleteAsync(id);
            }
            catch (Exception ex) 
            {
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = ex.Message;
                return _responseDTO;

            }
        }
       

        [HttpGet]
        [Route("GetEmployeeById/{id}")]
        [Authorize]
        public async Task<ResponseDTO> GetEmployeeByIdAsync([FromRoute] int id)
        {
            try
            {
                return await _employeeServices.GetEmployeeByIdAsync(id);
            }
            catch (Exception ex) 
            {
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = ex.Message;
                return _responseDTO;
            }
        }

        [HttpGet]
        [Route("GetAllEmployees")]
        [Authorize]
        public async Task<ResponseDTO> GetAllEmployeesAsync()
        {
            try
            {
                return await _employeeServices.GetAllEmployeesAsync();
            }
            catch (Exception ex)
            {
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = ex.Message;
                return _responseDTO;
            }
        }

        [HttpGet]
        [Route("GetAllManagers")]
        [Authorize]
        public async Task<ResponseDTO> GetAllManagersAsync()
        {
            try
            {
                return await _employeeServices.GetAllManagersAsync();
            }
            catch (Exception ex)
            {
                _responseDTO.Data = null;
                _responseDTO.isSuccess = false;
                _responseDTO.message = ex.Message;
                return _responseDTO;
            }
        }
    }
}
