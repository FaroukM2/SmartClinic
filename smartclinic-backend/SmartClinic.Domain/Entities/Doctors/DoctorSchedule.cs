using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class DoctorSchedule : AuditableEntity
    {
        public Guid DoctorBranchId { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public int MaxPatients { get; set; }

        #region Navigation Properties

        // Many Schedules -> One Doctor Branch
        public DoctorBranch DoctorBranch { get; set; } = null!;

        #endregion
    }
}
