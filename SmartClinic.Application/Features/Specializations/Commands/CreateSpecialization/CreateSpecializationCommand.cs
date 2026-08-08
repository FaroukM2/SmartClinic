using MediatR;
using System;

namespace SmartClinic.Application.Features.Specializations.Commands.CreateSpecialization
{
    public sealed record CreateSpecializationCommand(
        Guid ClinicId,
        string Name
    ) : IRequest<Guid>;
}
