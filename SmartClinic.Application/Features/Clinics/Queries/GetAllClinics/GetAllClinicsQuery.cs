using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Clinics.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Clinics.Queries.GetAllClinics
{
    public record GetAllClinicsQuery : IRequest<IReadOnlyList<ClinicDto>>;

    public class GetAllClinicsQueryHandler : IRequestHandler<GetAllClinicsQuery, IReadOnlyList<ClinicDto>>
    {
        private readonly IClinicRepository _clinicRepository;
        private readonly IMapper _mapper;

        public GetAllClinicsQueryHandler(IClinicRepository clinicRepository, IMapper mapper)
        {
            _clinicRepository = clinicRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ClinicDto>> Handle(GetAllClinicsQuery request, CancellationToken cancellationToken)
        {
            var clinics = await _clinicRepository.GetAllAsync(cancellationToken);
            return _mapper.Map<IReadOnlyList<ClinicDto>>(clinics);
        }
    }
}
