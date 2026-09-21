using MediatR;
using SmartClinic.Application.Features.Payments.DTOs;
using System;

namespace SmartClinic.Application.Features.Payments.Queries.GetPaymentByVisitId
{
    public sealed record GetPaymentByVisitIdQuery(Guid VisitId) : IRequest<PaymentDto?>;
}
