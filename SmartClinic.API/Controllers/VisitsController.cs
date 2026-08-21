using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Visits.Commands.StartVisit;
using SmartClinic.Application.Features.Visits.Commands.UpdateVisit;
using SmartClinic.Application.Features.Visits.Queries.GetVisitById;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VisitsController : ControllerBase
{
    private readonly IMediator _mediator;

    public VisitsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartVisitCommand command)
    {
        var visitId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = visitId }, visitId);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateVisitCommand command)
    {
        var success = await _mediator.Send(command);
        return success ? Ok() : BadRequest();
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var visit = await _mediator.Send(new GetVisitByIdQuery(id));
        return visit is null ? NotFound() : Ok(visit);
    }
}
