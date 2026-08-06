using SmartClinic.Domain.Common;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Patient : AuditableEntity
    {
        public Guid ClinicId { get; set; }

        public string MedicalCode { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public Gender Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string PrimaryPhone { get; set; } = null!;

        public string? SecondaryPhone { get; set; }

        public string? Address { get; set; }

        public bool IsActive { get; set; } = true;

        #region Navigation Properties

        // Many Patients -> One Clinic
        public Clinic Clinic { get; set; } = null!;

        // One Patient -> One Medical History
        public MedicalHistory? MedicalHistory { get; set; }

        // One Patient -> Many Appointments
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        #endregion
    }
}
