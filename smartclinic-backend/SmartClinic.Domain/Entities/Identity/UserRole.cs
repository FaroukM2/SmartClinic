using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class UserRole
    {
        public Guid UserId { get; set; }

        public Guid RoleId { get; set; }

        #region Navigation Properties

        // Many UserRoles -> One User
        public User User { get; set; } = null!;

        // Many UserRoles -> One Role
        public Role Role { get; set; } = null!;

        #endregion
    }
}
