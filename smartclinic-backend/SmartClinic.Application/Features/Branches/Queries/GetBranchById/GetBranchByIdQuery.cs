using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;
using System;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchById
{
    public sealed record GetBranchByIdQuery(Guid Id) : IRequest<BranchDto?>;
}
