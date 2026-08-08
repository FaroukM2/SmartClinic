using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Prescriptions.DTOs
{
    public class PrescriptionDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public string? Notes { get; set; }
        public List<PrescriptionItemDto> Items { get; set; } = new();
    }

    public class PrescriptionItemDto
    {
        public Guid Id { get; set; }
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public string? Instructions { get; set; }
    }

    public class CreatePrescriptionItemDto
    {
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public string? Instructions { get; set; }
    }
}
