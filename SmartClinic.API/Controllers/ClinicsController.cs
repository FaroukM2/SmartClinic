using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Clinics.Commands.CreateClinic;
using SmartClinic.Application.Features.Clinics.Queries.GetAllClinics;
using SmartClinic.Application.Features.Clinics.Queries.GetClinicById;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClinicsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClinicsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clinics = await _mediator.Send(new GetAllClinicsQuery());
        return Ok(clinics);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var clinic = await _mediator.Send(new GetClinicByIdQuery(id));
        return clinic is null ? NotFound() : Ok(clinic);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClinicCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }
}
