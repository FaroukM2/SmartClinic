using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Authentication.Commands.Register
{
    public sealed record RegisterUserCommand(
        Guid ClinicId,
        string FullName,
        string Email,
        string Password,
        string? PhoneNumber,
        UserType UserType
    ) : IRequest<LoginResponse>;
}
