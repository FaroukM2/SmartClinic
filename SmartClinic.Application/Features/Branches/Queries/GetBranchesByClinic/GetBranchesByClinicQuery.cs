using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchesByClinic
{
    public sealed record GetBranchesByClinicQuery(Guid ClinicId) : IRequest<IReadOnlyList<BranchDto>>;
}
