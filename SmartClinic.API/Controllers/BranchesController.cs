using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Branches.Commands.CreateBranch;
using SmartClinic.Application.Features.Branches.Commands.UpdateBranch;
using SmartClinic.Application.Features.Branches.Queries.GetBranchById;
using SmartClinic.Application.Features.Branches.Queries.GetBranchesByClinic;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BranchesController : ControllerBase
{
    private readonly IMediator _mediator;

    public BranchesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBranchCommand command)
    {
        var branchId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = branchId }, branchId);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBranchCommand command)
    {
        if (id != command.Id)
            return BadRequest("Mismatched Branch ID.");

        var success = await _mediator.Send(command);
        return success ? NoContent() : NotFound();
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetBranchByIdQuery(id));
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("clinic/{clinicId:guid}")]
    public async Task<IActionResult> GetByClinic(Guid clinicId)
    {
        var result = await _mediator.Send(new GetBranchesByClinicQuery(clinicId));
        return Ok(result);
    }
}
