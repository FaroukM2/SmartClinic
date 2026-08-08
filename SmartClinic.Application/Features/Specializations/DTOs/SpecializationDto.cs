using System;

namespace SmartClinic.Application.Features.Specializations.DTOs
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }
        public Guid ClinicId { get; set; }
        public string Name { get; set; } = null!;
    }
}
