using MediatR;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Visits.Commands.StartVisit
{
    public sealed record StartVisitCommand(
        Guid AppointmentId,
        VisitType VisitType = VisitType.NewVisit
    ) : IRequest<Guid>;
}
