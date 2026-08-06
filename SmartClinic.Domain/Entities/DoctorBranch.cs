using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class DoctorBranch : AuditableEntity
    {
        public Guid DoctorId { get; set; }

        public Guid BranchId { get; set; }

        public decimal ConsultationFee { get; set; }

        public decimal FollowUpFee { get; set; }

        public int FollowUpDaysLimit { get; set; }

        public int SlotDurationMinutes { get; set; }

        public bool IsActive { get; set; } = true;

        #region Navigation Properties

        // Many DoctorBranches -> One Doctor
        public Doctor Doctor { get; set; } = null!;

        // Many DoctorBranches -> One Branch
        public Branch Branch { get; set; } = null!;

        // One DoctorBranch -> Many Schedules
        public ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();

        // One DoctorBranch -> Many Appointments
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        #endregion
    }
}
