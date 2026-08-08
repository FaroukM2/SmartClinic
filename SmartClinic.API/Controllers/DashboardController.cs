using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Dashboard.Queries.GetDashboardStats;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats/{clinicId:guid}")]
    public async Task<IActionResult> GetStats(Guid clinicId)
    {
        var stats = await _mediator.Send(new GetDashboardStatsQuery(clinicId));
        return Ok(stats);
    }
}
