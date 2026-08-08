using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorById
{
    public class GetDoctorByIdQueryHandler : IRequestHandler<GetDoctorByIdQuery, DoctorDto?>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public GetDoctorByIdQueryHandler(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<DoctorDto?> Handle(GetDoctorByIdQuery request, CancellationToken cancellationToken)
        {
            var doctor = await _doctorRepository.GetByIdAsync(request.Id, cancellationToken);
            return doctor is null ? null : _mapper.Map<DoctorDto>(doctor);
        }
    }
}
