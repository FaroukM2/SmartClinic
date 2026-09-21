using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Clinic : AuditableEntity
    {
        public string Name { get; set; } = null!;

        public string Subdomain { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string? LogoUrl { get; set; }

        public bool IsActive { get; set; } = true;

        #region Navigation Properties

        // One Clinic -> Many Branches
        public ICollection<Branch> Branches { get; set; } = new List<Branch>();

        // One Clinic -> Many Users
        public ICollection<User> Users { get; set; } = new List<User>();

        // One Clinic -> Many Roles
        public ICollection<Role> Roles { get; set; } = new List<Role>();

        // One Clinic -> Many Patients
        public ICollection<Patient> Patients { get; set; } = new List<Patient>();

        // One Clinic -> Many Specializations
        public ICollection<Specialization> Specializations { get; set; } = new List<Specialization>();

        #endregion
    }
}
