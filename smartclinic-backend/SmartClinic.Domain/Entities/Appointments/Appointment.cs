using SmartClinic.Domain.Common;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Appointment : AuditableEntity
    {
        public Guid PatientId { get; set; }

        public Guid DoctorBranchId { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public int QueueNumber { get; set; }

        public AppointmentStatus AppointmentStatus { get; set; }

        public bool IsOverriddenByDoctor { get; set; }

        public string? Notes { get; set; }

        #region Navigation Properties

        // Many Appointments -> One Patient
        public Patient Patient { get; set; } = null!;

        // Many Appointments -> One Doctor Branch
        public DoctorBranch DoctorBranch { get; set; } = null!;

        // One Appointment -> One Visit
        public Visit? Visit { get; set; }

        #endregion
    }
}
