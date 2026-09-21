using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorsByClinic
{
    public class GetDoctorsByClinicQueryHandler : IRequestHandler<GetDoctorsByClinicQuery, IReadOnlyList<DoctorDto>>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public GetDoctorsByClinicQueryHandler(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<DoctorDto>> Handle(GetDoctorsByClinicQuery request, CancellationToken cancellationToken)
        {
            var doctors = await _doctorRepository.GetDoctorsByClinicIdAsync(request.ClinicId, cancellationToken);
            return _mapper.Map<IReadOnlyList<DoctorDto>>(doctors);
        }
    }
}
