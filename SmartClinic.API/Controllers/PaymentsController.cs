using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Payments.Commands.ProcessPayment;
using SmartClinic.Application.Features.Payments.Queries.GetPaymentByVisitId;
using SmartClinic.Application.Interfaces.Services;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;

    public PaymentsController(IMediator mediator, ICurrentUserService currentUserService)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    [HttpPost("process")]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentCommand command)
    {
        if (command.CreatedByUserId == Guid.Empty)
        {
            var userId = _currentUserService.UserId ?? Guid.Empty;
            command = command with { CreatedByUserId = userId };
        }

        var paymentId = await _mediator.Send(command);
        return Ok(paymentId);
    }

    [HttpGet("visit/{visitId:guid}")]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var payment = await _mediator.Send(new GetPaymentByVisitIdQuery(visitId));
        return payment is null ? NotFound() : Ok(payment);
    }
}
