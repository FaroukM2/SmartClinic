using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Specializations.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Specializations.Queries.GetAllSpecializations
{
    public class GetAllSpecializationsQueryHandler : IRequestHandler<GetAllSpecializationsQuery, IReadOnlyList<SpecializationDto>>
    {
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IMapper _mapper;

        public GetAllSpecializationsQueryHandler(
            ISpecializationRepository specializationRepository,
            IMapper mapper)
        {
            _specializationRepository = specializationRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<SpecializationDto>> Handle(GetAllSpecializationsQuery request, CancellationToken cancellationToken)
        {
            var specializations = await _specializationRepository.GetAllAsync(request.ClinicId, cancellationToken);
            return _mapper.Map<IReadOnlyList<SpecializationDto>>(specializations);
        }
    }
}
