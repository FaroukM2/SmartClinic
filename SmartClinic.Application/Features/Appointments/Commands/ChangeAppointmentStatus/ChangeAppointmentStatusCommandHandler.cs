using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Commands.ChangeAppointmentStatus
{
    public class ChangeAppointmentStatusCommandHandler : IRequestHandler<ChangeAppointmentStatusCommand, bool>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ChangeAppointmentStatusCommandHandler(
            IAppointmentRepository appointmentRepository,
            IUnitOfWork unitOfWork)
        {
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(ChangeAppointmentStatusCommand request, CancellationToken cancellationToken)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(request.AppointmentId, cancellationToken);
            if (appointment is null)
                return false;

            appointment.AppointmentStatus = request.Status;
            await _appointmentRepository.UpdateAppointmentAsync(appointment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
