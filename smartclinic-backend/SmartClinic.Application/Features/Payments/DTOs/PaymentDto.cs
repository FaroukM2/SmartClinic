using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Payments.DTOs
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal NetAmount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? ReceiptNumber { get; set; }
        public Guid CreatedByUserId { get; set; }
        public string? CreatedByUserName { get; set; }
    }
}
