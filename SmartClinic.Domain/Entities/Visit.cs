using SmartClinic.Domain.Common;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Visit : AuditableEntity
    {
        public Guid AppointmentId { get; set; }

        public DateTimeOffset VisitDate { get; set; }

        public VisitType VisitType { get; set; }

        public string? ChiefComplaint { get; set; }

        public string? PhysicalExamination { get; set; }

        public string? Diagnosis { get; set; }

        public string? DoctorNotes { get; set; }

        #region Navigation Properties

        // One Visit -> One Appointment
        public Appointment Appointment { get; set; } = null!;

        // One Visit -> One Prescription
        public Prescription? Prescription { get; set; }

        // One Visit -> One Payment
        public Payment? Payment { get; set; }

        // One Visit -> Many Attachments
        public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

        #endregion
    }
}
