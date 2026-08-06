using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Prescription : AuditableEntity
    {
        public Guid VisitId { get; set; }

        public string? Notes { get; set; }

        #region Navigation Properties

        // One Prescription -> One Visit
        public Visit Visit { get; set; } = null!;

        // One Prescription -> Many Prescription Items
        public ICollection<PrescriptionItem> PrescriptionItems { get; set; } = new List<PrescriptionItem>();

        #endregion
    }
}
