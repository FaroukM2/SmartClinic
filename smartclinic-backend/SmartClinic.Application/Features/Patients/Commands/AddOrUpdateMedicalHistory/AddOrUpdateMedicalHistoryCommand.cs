using MediatR;
using System;

namespace SmartClinic.Application.Features.Patients.Commands.AddOrUpdateMedicalHistory
{
    public sealed record AddOrUpdateMedicalHistoryCommand(
        Guid PatientId,
        string? ChronicDiseases,
        string? Allergies,
        string? PastSurgeries,
        string? Notes
    ) : IRequest<bool>;
}
