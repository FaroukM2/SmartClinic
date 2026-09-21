using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByDoctorBranch
{
    public class GetAppointmentsByDoctorBranchQueryHandler : IRequestHandler<GetAppointmentsByDoctorBranchQuery, IReadOnlyList<AppointmentDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetAppointmentsByDoctorBranchQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<AppointmentDto>> Handle(GetAppointmentsByDoctorBranchQuery request, CancellationToken cancellationToken)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDoctorBranchAsync(request.DoctorBranchId, request.Date, cancellationToken);
            return _mapper.Map<IReadOnlyList<AppointmentDto>>(appointments);
        }
    }
}
