using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class PrescriptionItem : AuditableEntity
    {
        public Guid PrescriptionId { get; set; }

        public string MedicineName { get; set; } = null!;

        public string Dosage { get; set; } = null!;

        public string Frequency { get; set; } = null!;

        public string Duration { get; set; } = null!;

        public string? Instructions { get; set; }

        #region Navigation Properties

        // Many Prescription Items -> One Prescription
        public Prescription Prescription { get; set; } = null!;

        #endregion
    }
}
