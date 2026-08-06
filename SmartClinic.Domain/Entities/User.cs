using SmartClinic.Domain.Common;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class User : AuditableEntity
    {
        public Guid ClinicId { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public UserType UserType { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTimeOffset? LastLogin { get; set; }

        public string? RefreshToken { get; set; }

        public DateTimeOffset? RefreshTokenExpiry { get; set; }

        #region Navigation Properties

        // Many Users -> One Clinic
        public Clinic Clinic { get; set; } = null!;

        // One User -> One Doctor
        public Doctor? Doctor { get; set; }

        // One User -> Many User Roles
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

        // One User -> Many Payments
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        #endregion
    }
}
