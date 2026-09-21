using MediatR;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Patients.Commands.CreatePatient
{
    public sealed record CreatePatientCommand(
        Guid ClinicId,
        string FullName,
        Gender Gender,
        DateOnly DateOfBirth,
        string PrimaryPhone,
        string? SecondaryPhone,
        string? Address
    ) : IRequest<Guid>;
}
