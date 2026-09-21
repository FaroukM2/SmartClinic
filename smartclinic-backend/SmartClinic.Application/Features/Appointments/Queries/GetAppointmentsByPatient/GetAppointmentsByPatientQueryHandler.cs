using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByPatient
{
    public class GetAppointmentsByPatientQueryHandler : IRequestHandler<GetAppointmentsByPatientQuery, IReadOnlyList<AppointmentDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetAppointmentsByPatientQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<AppointmentDto>> Handle(GetAppointmentsByPatientQuery request, CancellationToken cancellationToken)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByPatientAsync(request.PatientId, cancellationToken);
            return _mapper.Map<IReadOnlyList<AppointmentDto>>(appointments);
        }
    }
}
