using Service.LMSApi.Models.Domains;

namespace Service.LMSApi.Services.IServices
{
    public interface ITokenGenerator
    {
        string GenerateToken( Employee employee, string role);

    }
}
