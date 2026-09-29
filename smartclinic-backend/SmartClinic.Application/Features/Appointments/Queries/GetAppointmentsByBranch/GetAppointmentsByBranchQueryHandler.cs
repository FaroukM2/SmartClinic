using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByBranch
{
    public class GetAppointmentsByBranchQueryHandler : IRequestHandler<GetAppointmentsByBranchQuery, IReadOnlyList<AppointmentDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetAppointmentsByBranchQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<AppointmentDto>> Handle(GetAppointmentsByBranchQuery request, CancellationToken cancellationToken)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByBranchAsync(
                request.BranchId,
                request.Date,
                request.DoctorBranchId,
                request.DoctorId,
                cancellationToken);

            return _mapper.Map<IReadOnlyList<AppointmentDto>>(appointments);
        }
    }
}
