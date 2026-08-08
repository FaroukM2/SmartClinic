using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Payments.Commands.ProcessPayment;
using SmartClinic.Application.Features.Payments.Queries.GetPaymentByVisitId;
using System;
using System.Threading.Tasks;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("process")]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentCommand command)
    {
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
