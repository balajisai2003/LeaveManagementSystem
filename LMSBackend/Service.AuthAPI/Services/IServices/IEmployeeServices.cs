using Service.LMSApi.Models;

namespace Service.LMSApi.Services.IServices
{
    public interface IEmployeeServices
    {
        Task<ResponseDTO> RegisterAsync(EmpRequestDTO request);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<ResponseDTO> UpdateAsync(int id, EmpRequestDTO request);
        Task<ResponseDTO> DeleteAsync(int id);
        Task<ResponseDTO> GetEmployeeByIdAsync(int id);
        Task<ResponseDTO> GetAllEmployeesAsync();
        Task<ResponseDTO> GetAllManagersAsync();
    }
}
