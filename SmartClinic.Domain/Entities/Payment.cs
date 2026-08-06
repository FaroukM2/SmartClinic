using SmartClinic.Domain.Common;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Entities
{
    public class Payment : AuditableEntity
    {
        public Guid VisitId { get; set; }

        public decimal Amount { get; set; }

        public decimal Discount { get; set; }

        public decimal NetAmount { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

        public string? ReceiptNumber { get; set; }

        public Guid CreatedByUserId { get; set; }

        #region Navigation Properties

        // One Payment -> One Visit
        public Visit Visit { get; set; } = null!;

        // Many Payments -> One User
        public User CreatedByUser { get; set; } = null!;

        #endregion
    }
}
