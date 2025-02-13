using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Service.LMSApi.Models;
using Service.LMSApi.Models.Domains;
using Service.LMSApi.Services.IServices;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Service.LMSApi.Services
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly JwtOptions _jwtOptions;

        public TokenGenerator(IOptions<JwtOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
        }
        public string GenerateToken(Employee employee, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(_jwtOptions.Secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, employee.Email),
                new Claim(JwtRegisteredClaimNames.Sub, employee.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, employee.Email.ToString()),
                new Claim(ClaimTypes.Role, employee.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _jwtOptions.Audience,
                Issuer = _jwtOptions.Issuer,
                Subject = new ClaimsIdentity(claims),
                Expires = System.DateTime.UtcNow.AddMinutes(_jwtOptions.DurationInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };


            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
