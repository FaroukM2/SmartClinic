using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;

namespace SmartClinic.Application.Features.Authentication.Commands.ActivateDoctor
{
    public sealed record ActivateDoctorCommand(
        string Email,
        string Password
    ) : IRequest<LoginResponse>;
}
