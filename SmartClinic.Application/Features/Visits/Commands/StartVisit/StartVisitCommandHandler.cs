using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Visits.Commands.StartVisit
{
    public class StartVisitCommandHandler : IRequestHandler<StartVisitCommand, Guid>
    {
        private readonly IVisitRepository _visitRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public StartVisitCommandHandler(
            IVisitRepository visitRepository,
            IAppointmentRepository appointmentRepository,
            IUnitOfWork unitOfWork)
        {
            _visitRepository = visitRepository;
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(StartVisitCommand request, CancellationToken cancellationToken)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(request.AppointmentId, cancellationToken);
            if (appointment is null)
                throw new InvalidOperationException("Appointment not found.");

            var existingVisit = await _visitRepository.GetVisitByAppointmentIdAsync(request.AppointmentId, cancellationToken);
            if (existingVisit is not null)
                return existingVisit.Id;

            var visit = new Visit
            {
                AppointmentId = request.AppointmentId,
                VisitDate = DateTimeOffset.UtcNow,
                VisitType = request.VisitType
            };

            appointment.AppointmentStatus = AppointmentStatus.InConsultation;

            await _visitRepository.AddVisitAsync(visit, cancellationToken);
            await _appointmentRepository.UpdateAppointmentAsync(appointment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return visit.Id;
        }
    }
}
