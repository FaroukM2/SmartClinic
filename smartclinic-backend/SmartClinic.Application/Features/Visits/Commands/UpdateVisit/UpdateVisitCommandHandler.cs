using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Visits.Commands.UpdateVisit
{
    public class UpdateVisitCommandHandler : IRequestHandler<UpdateVisitCommand, bool>
    {
        private readonly IVisitRepository _visitRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateVisitCommandHandler(
            IVisitRepository visitRepository,
            IAppointmentRepository appointmentRepository,
            IUnitOfWork unitOfWork)
        {
            _visitRepository = visitRepository;
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(UpdateVisitCommand request, CancellationToken cancellationToken)
        {
            var visit = await _visitRepository.GetVisitByIdAsync(request.VisitId, cancellationToken);
            if (visit is null)
                return false;

            visit.ChiefComplaint = request.ChiefComplaint;
            visit.PhysicalExamination = request.PhysicalExamination;
            visit.Diagnosis = request.Diagnosis;
            visit.DoctorNotes = request.DoctorNotes;

            if (request.IsCompleted && visit.Appointment is not null)
            {
                visit.Appointment.AppointmentStatus = AppointmentStatus.Completed;
                await _appointmentRepository.UpdateAppointmentAsync(visit.Appointment, cancellationToken);
            }

            await _visitRepository.UpdateVisitAsync(visit, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
