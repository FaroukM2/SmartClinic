using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Doctors.DTOs
{
    public class DoctorDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public Guid SpecializationId { get; set; }
        public string SpecializationName { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
        public int YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public List<DoctorBranchDto> Branches { get; set; } = new();
    }

    public class DoctorBranchDto
    {
        public Guid DoctorId { get; set; }
        public Guid BranchId { get; set; }
        public string BranchName { get; set; } = null!;
        public decimal ConsultationFee { get; set; }
        public decimal FollowUpFee { get; set; }
        public int FollowUpDaysLimit { get; set; }
        public int SlotDurationMinutes { get; set; }
        public bool IsActive { get; set; }
        public List<DoctorScheduleDto> Schedules { get; set; } = new();
    }

    public class DoctorScheduleDto
    {
        public Guid Id { get; set; }
        public Guid DoctorBranchId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int MaxPatients { get; set; }
    }
}
