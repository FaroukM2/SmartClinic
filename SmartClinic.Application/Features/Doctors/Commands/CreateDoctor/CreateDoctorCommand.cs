using MediatR;
using System;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public sealed record CreateDoctorCommand(
        Guid ClinicId,
        string FullName,
        string Email,
        string PhoneNumber,
        Guid SpecializationId,
        string LicenseNumber,
        int YearsOfExperience = 1,
        string? Bio = null
    ) : IRequest<Guid>;
}
