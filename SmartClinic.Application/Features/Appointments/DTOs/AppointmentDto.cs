using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Appointments.DTOs
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = null!;
        public string PatientPhone { get; set; } = null!;
        public Guid DoctorBranchId { get; set; }
        public string DoctorName { get; set; } = null!;
        public string BranchName { get; set; } = null!;
        public DateOnly AppointmentDate { get; set; }
        public int QueueNumber { get; set; }
        public AppointmentStatus AppointmentStatus { get; set; }
        public bool IsOverriddenByDoctor { get; set; }
        public string? Notes { get; set; }
        public Guid? VisitId { get; set; }
    }
}
