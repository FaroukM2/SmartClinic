using MediatR;
using System;

namespace SmartClinic.Application.Features.Branches.Commands.UpdateBranch
{
    public sealed record UpdateBranchCommand(
        Guid Id,
        string Name,
        string Address,
        string Phone,
        bool IsMainBranch,
        bool IsActive
    ) : IRequest<bool>;
}
