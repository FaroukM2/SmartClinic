using MediatR;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Payments.Commands.ProcessPayment
{
    public sealed record ProcessPaymentCommand(
        Guid VisitId,
        decimal Amount,
        decimal Discount,
        PaymentMethod PaymentMethod,
        Guid CreatedByUserId
    ) : IRequest<Guid>;
}
