using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Patients.DTOs
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public Guid ClinicId { get; set; }
        public string MedicalCode { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public Gender Gender { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string PrimaryPhone { get; set; } = null!;
        public string? SecondaryPhone { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; }
        public MedicalHistoryDto? MedicalHistory { get; set; }
    }

    public class MedicalHistoryDto
    {
        public Guid PatientId { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? Allergies { get; set; }
        public string? PastSurgeries { get; set; }
        public string? Notes { get; set; }
    }

    public class AttachmentDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;
        public string FileType { get; set; } = null!;
    }
}
