using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Commands.BookAppointment
{
    public class BookAppointmentCommandHandler : IRequestHandler<BookAppointmentCommand, Guid>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IBranchRepository _branchRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BookAppointmentCommandHandler(
            IAppointmentRepository appointmentRepository,
            IDoctorRepository doctorRepository,
            IBranchRepository branchRepository,
            IUnitOfWork unitOfWork)
        {
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
            _branchRepository = branchRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var targetDoctorBranchId = request.DoctorBranchId != Guid.Empty
                ? request.DoctorBranchId
                : (request.DoctorId ?? Guid.Empty);

            // 1. Verify if targetDoctorBranchId is already a valid DoctorBranch
            var doctorBranch = await _doctorRepository.GetDoctorBranchByIdAsync(targetDoctorBranchId, cancellationToken);

            // 2. If branchId is explicitly given, look for DoctorBranch with (doctorId, branchId)
            if (doctorBranch == null && request.DoctorId.HasValue && request.DoctorId.Value != Guid.Empty && request.BranchId.HasValue && request.BranchId.Value != Guid.Empty)
            {
                doctorBranch = await _doctorRepository.GetDoctorBranchAsync(request.DoctorId.Value, request.BranchId.Value, cancellationToken);
                if (doctorBranch != null)
                {
                    targetDoctorBranchId = doctorBranch.Id;
                }
            }

            // 3. If not found, check if request.DoctorBranchId was passed as a DoctorId
            if (doctorBranch == null)
            {
                doctorBranch = await _doctorRepository.GetFirstDoctorBranchByDoctorIdAsync(targetDoctorBranchId, cancellationToken);
                if (doctorBranch != null)
                {
                    targetDoctorBranchId = doctorBranch.Id;
                }
            }

            // 4. If still not found, check if Doctor exists and automatically link to selected branch or main branch
            if (doctorBranch == null)
            {
                var doctor = await _doctorRepository.GetByIdAsync(targetDoctorBranchId, cancellationToken);
                if (doctor != null)
                {
                    var branches = await _branchRepository.GetByClinicIdAsync(doctor.User.ClinicId, cancellationToken);
                    var branch = (request.BranchId.HasValue && request.BranchId.Value != Guid.Empty)
                        ? branches.FirstOrDefault(b => b.Id == request.BranchId.Value)
                        : (branches.FirstOrDefault(b => b.IsMainBranch) ?? branches.FirstOrDefault());

                    if (branch != null)
                    {
                        doctorBranch = new DoctorBranch
                        {
                            DoctorId = doctor.Id,
                            BranchId = branch.Id,
                            ConsultationFee = 350m,
                            FollowUpFee = 150m,
                            FollowUpDaysLimit = 14,
                            SlotDurationMinutes = 20,
                            IsActive = true
                        };
                        await _doctorRepository.AddDoctorBranchAsync(doctorBranch, cancellationToken);
                        await _unitOfWork.SaveChangesAsync(cancellationToken);
                        targetDoctorBranchId = doctorBranch.Id;
                    }
                }
            }

            if (doctorBranch == null)
            {
                throw new InvalidOperationException("Selected doctor or branch assignment could not be found.");
            }

            // 5. Conflict check if StartTime is provided
            if (!string.IsNullOrWhiteSpace(request.StartTime))
            {
                var cleanStartTime = request.StartTime.Trim();
                var existingAppointments = await _appointmentRepository.GetAppointmentsByDoctorBranchAsync(
                    targetDoctorBranchId,
                    request.AppointmentDate,
                    cancellationToken);

                var isConflicting = existingAppointments.Any(a =>
                    a.AppointmentStatus != AppointmentStatus.Cancelled &&
                    a.AppointmentStatus != AppointmentStatus.NoShow &&
                    a.Notes != null && a.Notes.Contains($"[{cleanStartTime}"));

                if (isConflicting)
                {
                    throw new InvalidOperationException($"The time slot {cleanStartTime} is already booked for this doctor on {request.AppointmentDate}. Please select another time.");
                }
            }

            var nextQueueNumber = await _appointmentRepository.GetNextQueueNumberAsync(
                targetDoctorBranchId,
                request.AppointmentDate,
                cancellationToken);

            // Construct notes with time prefix if available
            var formattedNotes = request.Notes?.Trim();
            if (!string.IsNullOrWhiteSpace(request.StartTime))
            {
                var timePrefix = $"[{request.StartTime.Trim()}]";
                formattedNotes = string.IsNullOrWhiteSpace(formattedNotes)
                    ? timePrefix
                    : $"{timePrefix} {formattedNotes}";
            }

            var appointment = new Appointment
            {
                PatientId = request.PatientId,
                DoctorBranchId = targetDoctorBranchId,
                AppointmentDate = request.AppointmentDate,
                QueueNumber = nextQueueNumber,
                AppointmentStatus = AppointmentStatus.Reserved,
                IsOverriddenByDoctor = request.IsOverriddenByDoctor,
                Notes = formattedNotes
            };

            await _appointmentRepository.AddAppointmentAsync(appointment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return appointment.Id;
        }
    }
}
