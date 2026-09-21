using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public class CreateBranchCommandHandler : IRequestHandler<CreateBranchCommand, Guid>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateBranchCommandHandler(
            IBranchRepository branchRepository,
            IUnitOfWork unitOfWork)
        {
            _branchRepository = branchRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateBranchCommand request, CancellationToken cancellationToken)
        {
            var branch = new Branch
            {
                ClinicId = request.ClinicId,
                Name = request.Name,
                Address = request.Address,
                Phone = request.Phone,
                IsMainBranch = request.IsMainBranch,
                IsActive = true
            };

            await _branchRepository.AddAsync(branch, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return branch.Id;
        }
    }
}
