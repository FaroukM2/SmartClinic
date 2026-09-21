using MediatR;
using System;

namespace SmartClinic.Application.Features.Visits.Commands.UpdateVisit
{
    public sealed record UpdateVisitCommand(
        Guid VisitId,
        string? ChiefComplaint,
        string? PhysicalExamination,
        string? Diagnosis,
        string? DoctorNotes,
        bool IsCompleted = false
    ) : IRequest<bool>;
}
