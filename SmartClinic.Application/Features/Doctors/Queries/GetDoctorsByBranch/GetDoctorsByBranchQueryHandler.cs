using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorsByBranch
{
    public class GetDoctorsByBranchQueryHandler : IRequestHandler<GetDoctorsByBranchQuery, IReadOnlyList<DoctorDto>>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public GetDoctorsByBranchQueryHandler(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<DoctorDto>> Handle(GetDoctorsByBranchQuery request, CancellationToken cancellationToken)
        {
            var doctors = await _doctorRepository.GetDoctorsByBranchIdAsync(request.BranchId, cancellationToken);
            return _mapper.Map<IReadOnlyList<DoctorDto>>(doctors);
        }
    }
}
