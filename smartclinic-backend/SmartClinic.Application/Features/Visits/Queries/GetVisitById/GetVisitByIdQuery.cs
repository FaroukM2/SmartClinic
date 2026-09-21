using MediatR;
using SmartClinic.Application.Features.Visits.DTOs;
using System;

namespace SmartClinic.Application.Features.Visits.Queries.GetVisitById
{
    public sealed record GetVisitByIdQuery(Guid Id) : IRequest<VisitDto?>;
}
