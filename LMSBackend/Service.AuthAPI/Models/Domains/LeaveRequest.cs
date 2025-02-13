using System.ComponentModel.DataAnnotations;

namespace Service.LMSApi.Models.Domains
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int EmpId { get; set; }
        [Required]
        public int ManagerId { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime StartDateTime { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime EndDateTime { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public string ReqStatus { get; set; } = "Pending";
        [Required]
        public string LeaveType { get; set; } = "Casual Leave";
    }

}
