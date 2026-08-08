using MediatR;
using System;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public sealed record CreateDoctorCommand(
        Guid UserId,
        Guid SpecializationId,
        string LicenseNumber,
        int YearsOfExperience,
        string? Bio
    ) : IRequest<Guid>;
}
