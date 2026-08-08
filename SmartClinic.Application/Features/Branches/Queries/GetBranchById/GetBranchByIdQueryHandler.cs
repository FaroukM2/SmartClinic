using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchById
{
    public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, BranchDto?>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IMapper _mapper;

        public GetBranchByIdQueryHandler(IBranchRepository branchRepository, IMapper mapper)
        {
            _branchRepository = branchRepository;
            _mapper = mapper;
        }

        public async Task<BranchDto?> Handle(GetBranchByIdQuery request, CancellationToken cancellationToken)
        {
            var branch = await _branchRepository.GetByIdAsync(request.Id, cancellationToken);
            return branch is null ? null : _mapper.Map<BranchDto>(branch);
        }
    }
}
