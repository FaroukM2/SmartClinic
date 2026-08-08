using MediatR;
using SmartClinic.Application.Features.Prescriptions.DTOs;
using System;

namespace SmartClinic.Application.Features.Prescriptions.Queries.GetPrescriptionByVisitId
{
    public sealed record GetPrescriptionByVisitIdQuery(Guid VisitId) : IRequest<PrescriptionDto?>;
}
