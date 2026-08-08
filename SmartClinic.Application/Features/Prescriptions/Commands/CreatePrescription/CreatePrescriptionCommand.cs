using MediatR;
using SmartClinic.Application.Features.Prescriptions.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Prescriptions.Commands.CreatePrescription
{
    public sealed record CreatePrescriptionCommand(
        Guid VisitId,
        string? Notes,
        List<CreatePrescriptionItemDto> Items
    ) : IRequest<Guid>;
}
