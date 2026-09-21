using SmartClinic.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Attachment : AuditableEntity
    {
        public Guid VisitId { get; set; }

        public string FileName { get; set; } = null!;

        public string FilePath { get; set; } = null!;

        public string FileType { get; set; } = null!;

        #region Navigation Properties

        // Many Attachments -> One Visit
        public Visit Visit { get; set; } = null!;

        #endregion
    }
}
