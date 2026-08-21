using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Specializations.Commands.CreateSpecialization;
using SmartClinic.Application.Features.Specializations.Queries.GetAllSpecializations;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SpecializationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SpecializationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSpecializationCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpGet("clinic/{clinicId:guid}")]
    public async Task<IActionResult> GetAll(Guid clinicId)
    {
        var result = await _mediator.Send(new GetAllSpecializationsQuery(clinicId));
        return Ok(result);
    }
}
