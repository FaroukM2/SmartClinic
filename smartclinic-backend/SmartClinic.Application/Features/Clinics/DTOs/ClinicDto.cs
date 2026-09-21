using System;

namespace SmartClinic.Application.Features.Clinics.DTOs
{
    public class ClinicDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Subdomain { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Address { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
