using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Branch : AuditableEntity
    {
        public Guid ClinicId { get; set; }

        public string Name { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public bool IsMainBranch { get; set; }

        public bool IsActive { get; set; } = true;

        #region Navigation Properties

        // Many Branches -> One Clinic
        public Clinic Clinic { get; set; } = null!;

        // One Branch -> Many Doctor Branches
        public ICollection<DoctorBranch> DoctorBranches { get; set; } = new List<DoctorBranch>();

        #endregion
    }
}
