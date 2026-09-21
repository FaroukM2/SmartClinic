using MediatR;
using SmartClinic.Application.Features.Dashboard.DTOs;
using System;

namespace SmartClinic.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public sealed record GetDashboardStatsQuery(Guid ClinicId) : IRequest<DashboardStatsDto>;
}
