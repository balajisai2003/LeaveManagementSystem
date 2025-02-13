using Service.LMSApi.Models.Domains;
using Service.LMSApi.Utils;
using System.ComponentModel.DataAnnotations;

namespace Service.LMSApi.Models.Domains
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; }

        public int? ManagerId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } 

        [Required]
        [MaxLength(255)]
        public string Password { get; set; }

    }
}







//public Employee MapRequestToDomain(EmployeeRequest request)
//{
//    return new Employee
//    {
//        Name = request.Name,
//        Email = request.Email,
//        ManagerId = request.ManagerId,
//        Role = (Role)request.Role, // Convert int to Role enum
//        Password = request.Password
//    };
//}