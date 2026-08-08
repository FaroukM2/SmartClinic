using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Prescriptions.Commands.CreatePrescription;
using SmartClinic.Application.Features.Prescriptions.Queries.GetPrescriptionByVisitId;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrescriptionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PrescriptionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePrescriptionCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpGet("visit/{visitId:guid}")]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var prescription = await _mediator.Send(new GetPrescriptionByVisitIdQuery(visitId));
        return prescription is null ? NotFound() : Ok(prescription);
    }
}
