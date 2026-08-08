using System;

namespace SmartClinic.Application.Features.Branches.DTOs
{
    public class BranchDto
    {
        public Guid Id { get; set; }
        public Guid ClinicId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool IsMainBranch { get; set; }
        public bool IsActive { get; set; }
    }
}
