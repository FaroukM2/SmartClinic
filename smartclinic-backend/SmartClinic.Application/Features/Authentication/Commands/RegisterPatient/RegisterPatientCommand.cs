using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Authentication.Commands.RegisterPatient
{
    public sealed record RegisterPatientCommand(
        Guid ClinicId,
        string FullName,
        string Email,
        string Password,
        string PhoneNumber,
        Gender Gender,
        DateOnly DateOfBirth,
        string? Address
    ) : IRequest<LoginResponse>;
}
