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
        if (command.DoctorBranchId == Guid.Empty && command.DoctorId.HasValue && command.DoctorId.Value != Guid.Empty)
        {
            command = command with { DoctorBranchId = command.DoctorId.Value };
        }

        var appointmentId = await _mediator.Send(command);
        return Ok(appointmentId);
    }

    [HttpPut("status")]
    public async Task<IActionResult> ChangeStatus([FromBody] ChangeAppointmentStatusCommand command)
    {
        var success = await _mediator.Send(command);
        return success ? Ok() : BadRequest();
    }

    [HttpGet("branch/{branchId:guid}")]
    public async Task<IActionResult> GetByBranch(
        Guid branchId,
        [FromQuery] DateOnly date,
        [FromQuery] Guid? doctorId,
        [FromQuery] Guid? doctorBranchId)
    {
        var result = await _mediator.Send(new SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByBranch.GetAppointmentsByBranchQuery(
            branchId,
            date,
            doctorId,
            doctorBranchId));
        return Ok(result);
    }

    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] Guid branchId,
        [FromQuery] Guid? doctorId,
        [FromQuery] Guid? doctorBranchId,
        [FromQuery] DateOnly date)
    {
        var result = await _mediator.Send(new SmartClinic.Application.Features.Appointments.Queries.GetAvailableTimeSlots.GetAvailableTimeSlotsQuery(
            branchId,
            doctorId,
            doctorBranchId,
            date));
        return Ok(result);
    }

    [HttpGet("doctor-branch/{doctorBranchId:guid}")]
    public async Task<IActionResult> GetByDoctorBranch(Guid doctorBranchId, [FromQuery] DateOnly date)
    {
        var result = await _mediator.Send(new GetAppointmentsByDoctorBranchQuery(doctorBranchId, date));
        return Ok(result);
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetByPatient(Guid patientId)
    {
        var result = await _mediator.Send(new SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByPatient.GetAppointmentsByPatientQuery(patientId));
        return Ok(result);
    }
}
