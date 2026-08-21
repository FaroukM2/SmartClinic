using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Appointments.Commands.BookAppointment;
using SmartClinic.Application.Features.Appointments.Commands.ChangeAppointmentStatus;
using SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByDoctorBranch;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookAppointmentCommand command)
    {
        var appointmentId = await _mediator.Send(command);
        return Ok(appointmentId);
    }

    [HttpPut("status")]
    public async Task<IActionResult> ChangeStatus([FromBody] ChangeAppointmentStatusCommand command)
    {
        var success = await _mediator.Send(command);
        return success ? Ok() : BadRequest();
    }

    [HttpGet("doctor-branch/{doctorBranchId:guid}")]
    public async Task<IActionResult> GetByDoctorBranch(Guid doctorBranchId, [FromQuery] DateOnly date)
    {
        var result = await _mediator.Send(new GetAppointmentsByDoctorBranchQuery(doctorBranchId, date));
        return Ok(result);
    }
}
