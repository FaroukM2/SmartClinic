using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchesByClinic
{
    public class GetBranchesByClinicQueryHandler : IRequestHandler<GetBranchesByClinicQuery, IReadOnlyList<BranchDto>>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IMapper _mapper;

        public GetBranchesByClinicQueryHandler(IBranchRepository branchRepository, IMapper mapper)
        {
            _branchRepository = branchRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<BranchDto>> Handle(GetBranchesByClinicQuery request, CancellationToken cancellationToken)
        {
            var branches = await _branchRepository.GetByClinicIdAsync(request.ClinicId, cancellationToken);
            return _mapper.Map<IReadOnlyList<BranchDto>>(branches);
        }
    }
}
