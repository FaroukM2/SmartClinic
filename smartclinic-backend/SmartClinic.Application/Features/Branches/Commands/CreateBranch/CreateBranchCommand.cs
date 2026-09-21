using MediatR;
using System;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public sealed record CreateBranchCommand(
        Guid ClinicId,
        string Name,
        string Address,
        string Phone,
        bool IsMainBranch
    ) : IRequest<Guid>;
}
