using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Application.Features.Authentication.Commands.Register;
using System.Threading.Tasks;

using SmartClinic.Application.Features.Authentication.Commands.ActivateDoctor;
using SmartClinic.Application.Features.Authentication.Commands.RegisterPatient;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("register-patient")]
    public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("activate-doctor")]
    public async Task<IActionResult> ActivateDoctor([FromBody] ActivateDoctorCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}