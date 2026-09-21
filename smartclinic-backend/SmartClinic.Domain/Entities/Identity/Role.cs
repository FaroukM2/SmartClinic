using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Role : AuditableEntity
    {
        public Guid ClinicId { get; set; }

        public string Name { get; set; } = null!;

        #region Navigation Properties

        // Many Roles -> One Clinic
        public Clinic Clinic { get; set; } = null!;

        // One Role -> Many User Roles
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

        #endregion
    }
}
