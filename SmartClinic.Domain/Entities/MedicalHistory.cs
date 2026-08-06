using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class MedicalHistory : AuditableEntity
    {
        public Guid PatientId { get; set; }

        public string? ChronicDiseases { get; set; }

        public string? Allergies { get; set; }

        public string? PastSurgeries { get; set; }

        public string? Notes { get; set; }

        #region Navigation Properties

        // One Medical History -> One Patient
        public Patient Patient { get; set; } = null!;

        #endregion
    }
}
