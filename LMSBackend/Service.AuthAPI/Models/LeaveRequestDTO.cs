using System;
using System.ComponentModel.DataAnnotations;
using Service.LMSApi.Utils;

namespace Service.LMSApi.Models
{
    public class LeaveRequestDTO
    {
        [Required(ErrorMessage = "Employee ID is required.")]
        public int EmpId { get; set; }

        [Required(ErrorMessage = "Manager ID is required.")]
        public int ManagerId { get; set; }

        [Required(ErrorMessage = "Start DateTime is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date format for Start DateTime.")]
        public DateTime StartDateTime { get; set; }

        [Required(ErrorMessage = "End DateTime is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date format for End DateTime.")]
        [CompareDates("StartDateTime", ErrorMessage = "End DateTime must be later than Start DateTime.")]
        public DateTime EndDateTime { get; set; }

        [Required(ErrorMessage = "Reason is required.")]
        [MaxLength(1000, ErrorMessage = "Reason cannot exceed 1000 characters.")]
        public string Reason { get; set; }

        [Required(ErrorMessage = "Leave Type is required.")]
        [Range(1, 4, ErrorMessage = "Invalid Leave Type. Valid values are 1 (Maternity Leave), 2 (Paid Leave), 3 (Casual Leave), 4 (Sick Leave).")]
        public int LeaveType { get; set; }

    }

    // Custom Validation Attribute to ensure EndDateTime > StartDateTime
    public class CompareDatesAttribute : ValidationAttribute
    {
        private readonly string _comparisonProperty;

        public CompareDatesAttribute(string comparisonProperty)
        {
            _comparisonProperty = comparisonProperty;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var currentValue = (DateTime?)value;
            var property = validationContext.ObjectType.GetProperty(_comparisonProperty);

            if (property == null)
                return new ValidationResult($"Property '{_comparisonProperty}' does not exist.");

            var comparisonValue = (DateTime?)property.GetValue(validationContext.ObjectInstance);

            if (currentValue <= comparisonValue)
                return new ValidationResult(ErrorMessage);

            return ValidationResult.Success;
        }
    }
}
