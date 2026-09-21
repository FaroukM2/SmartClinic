using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Visits.DTOs
{
    public class VisitDto
    {
        public Guid Id { get; set; }
        public Guid AppointmentId { get; set; }
        public DateTimeOffset VisitDate { get; set; }
        public VisitType VisitType { get; set; }
        public string? ChiefComplaint { get; set; }
        public string? PhysicalExamination { get; set; }
        public string? Diagnosis { get; set; }
        public string? DoctorNotes { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = null!;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = null!;
        public bool HasPrescription { get; set; }
        public bool HasPayment { get; set; }
    }
}
