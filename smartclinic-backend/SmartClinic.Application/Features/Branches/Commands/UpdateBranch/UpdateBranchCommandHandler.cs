using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Branches.Commands.UpdateBranch
{
    public class UpdateBranchCommandHandler : IRequestHandler<UpdateBranchCommand, bool>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateBranchCommandHandler(
            IBranchRepository branchRepository,
            IUnitOfWork unitOfWork)
        {
            _branchRepository = branchRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(UpdateBranchCommand request, CancellationToken cancellationToken)
        {
            var branch = await _branchRepository.GetByIdAsync(request.Id, cancellationToken);
            if (branch is null)
                return false;

            branch.Name = request.Name;
            branch.Address = request.Address;
            branch.Phone = request.Phone;
            branch.IsMainBranch = request.IsMainBranch;
            branch.IsActive = request.IsActive;

            await _branchRepository.UpdateAsync(branch, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
