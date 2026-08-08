using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Doctors.Commands.AssignDoctorToBranch;
using SmartClinic.Application.Features.Doctors.Commands.CreateDoctor;
using SmartClinic.Application.Features.Doctors.Commands.SetDoctorSchedule;
using SmartClinic.Application.Features.Doctors.Queries.GetDoctorById;
using SmartClinic.Application.Features.Doctors.Queries.GetDoctorsByBranch;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DoctorsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDoctorCommand command)
    {
        var doctorId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = doctorId }, doctorId);
    }

    [HttpPost("assign-branch")]
    public async Task<IActionResult> AssignToBranch([FromBody] AssignDoctorToBranchCommand command)
    {
        var success = await _mediator.Send(command);
        return success ? Ok() : BadRequest();
    }

    [HttpPost("schedule")]
    public async Task<IActionResult> SetSchedule([FromBody] SetDoctorScheduleCommand command)
    {
        var scheduleId = await _mediator.Send(command);
        return Ok(scheduleId);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var doctor = await _mediator.Send(new GetDoctorByIdQuery(id));
        return doctor is null ? NotFound() : Ok(doctor);
    }

    [HttpGet("branch/{branchId:guid}")]
    public async Task<IActionResult> GetByBranch(Guid branchId)
    {
        var doctors = await _mediator.Send(new GetDoctorsByBranchQuery(branchId));
        return Ok(doctors);
    }
}
