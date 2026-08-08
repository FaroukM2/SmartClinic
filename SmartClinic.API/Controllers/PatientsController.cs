using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Patients.Commands.AddOrUpdateMedicalHistory;
using SmartClinic.Application.Features.Patients.Commands.CreatePatient;
using SmartClinic.Application.Features.Patients.Queries.GetPatientById;
using SmartClinic.Application.Features.Patients.Queries.SearchPatients;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PatientsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientCommand command)
    {
        var patientId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = patientId }, patientId);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var patient = await _mediator.Send(new GetPatientByIdQuery(id));
        return patient is null ? NotFound() : Ok(patient);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] Guid clinicId, [FromQuery] string? searchTerm)
    {
        var result = await _mediator.Send(new SearchPatientsQuery(clinicId, searchTerm));
        return Ok(result);
    }

    [HttpPost("medical-history")]
    public async Task<IActionResult> AddOrUpdateMedicalHistory([FromBody] AddOrUpdateMedicalHistoryCommand command)
    {
        var success = await _mediator.Send(command);
        return success ? Ok() : BadRequest();
    }
}
