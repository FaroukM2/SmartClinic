using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Patients.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Patients.Queries.SearchPatients
{
    public class SearchPatientsQueryHandler : IRequestHandler<SearchPatientsQuery, IReadOnlyList<PatientDto>>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public SearchPatientsQueryHandler(IPatientRepository patientRepository, IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<PatientDto>> Handle(SearchPatientsQuery request, CancellationToken cancellationToken)
        {
            var patients = await _patientRepository.SearchAsync(request.ClinicId, request.SearchTerm, cancellationToken);
            return _mapper.Map<IReadOnlyList<PatientDto>>(patients);
        }
    }
}
