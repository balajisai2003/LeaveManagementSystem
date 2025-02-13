using System.ComponentModel.DataAnnotations;

namespace Service.LMSApi.Models
{
    public class EmpRequestDTO
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(255, ErrorMessage = "Email cannot exceed 255 characters.")]
        public string Email { get; set; }

        public int? ManagerId { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        [Range(1, 3, ErrorMessage = "Role must be between Employee, Manager and Admin.")]
        public int Role { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; }
    }
}
