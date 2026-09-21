using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Specialization : AuditableEntity
    {
        public Guid ClinicId { get; set; }

        public string Name { get; set; } = null!;

        #region Navigation Properties

        // Many Specializations -> One Clinic
        public Clinic Clinic { get; set; } = null!;

        // One Specialization -> Many Doctors
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();

        #endregion
    }
}
