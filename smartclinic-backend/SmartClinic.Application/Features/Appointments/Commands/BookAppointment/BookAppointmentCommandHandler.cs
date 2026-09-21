using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Commands.BookAppointment
{
    public class BookAppointmentCommandHandler : IRequestHandler<BookAppointmentCommand, Guid>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BookAppointmentCommandHandler(
            IAppointmentRepository appointmentRepository,
            IUnitOfWork unitOfWork)
        {
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var nextQueueNumber = await _appointmentRepository.GetNextQueueNumberAsync(
                request.DoctorBranchId,
                request.AppointmentDate,
                cancellationToken);

            var appointment = new Appointment
            {
                PatientId = request.PatientId,
                DoctorBranchId = request.DoctorBranchId,
                AppointmentDate = request.AppointmentDate,
                QueueNumber = nextQueueNumber,
                AppointmentStatus = AppointmentStatus.Reserved,
                IsOverriddenByDoctor = request.IsOverriddenByDoctor,
                Notes = request.Notes
            };

            await _appointmentRepository.AddAppointmentAsync(appointment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return appointment.Id;
        }
    }
}
