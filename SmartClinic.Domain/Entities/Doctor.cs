using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Doctor : AuditableEntity
    {
        public Guid SpecializationId { get; set; }

        public string LicenseNumber { get; set; } = null!;

        public int YearsOfExperience { get; set; }

        public string? Bio { get; set; }

        #region Navigation Properties

        // One Doctor -> One User
        public User User { get; set; } = null!;

        // Many Doctors -> One Specialization
        public Specialization Specialization { get; set; } = null!;

        // One Doctor -> Many Doctor Branches
        public ICollection<DoctorBranch> DoctorBranches { get; set; } = new List<DoctorBranch>();

        #endregion
    }
}
