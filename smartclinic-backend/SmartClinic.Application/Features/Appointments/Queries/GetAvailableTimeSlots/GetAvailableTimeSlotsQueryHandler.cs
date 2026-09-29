using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAvailableTimeSlots
{
    public class GetAvailableTimeSlotsQueryHandler : IRequestHandler<GetAvailableTimeSlotsQuery, IReadOnlyList<AvailableTimeSlotDto>>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IAppointmentRepository _appointmentRepository;

        public GetAvailableTimeSlotsQueryHandler(
            IDoctorRepository doctorRepository,
            IAppointmentRepository appointmentRepository)
        {
            _doctorRepository = doctorRepository;
            _appointmentRepository = appointmentRepository;
        }

        public async Task<IReadOnlyList<AvailableTimeSlotDto>> Handle(GetAvailableTimeSlotsQuery request, CancellationToken cancellationToken)
        {
            DoctorBranch? doctorBranch = null;

            if (request.DoctorBranchId.HasValue && request.DoctorBranchId.Value != Guid.Empty)
            {
                doctorBranch = await _doctorRepository.GetDoctorBranchByIdAsync(request.DoctorBranchId.Value, cancellationToken);
            }

            if (doctorBranch == null && request.DoctorId.HasValue && request.DoctorId.Value != Guid.Empty)
            {
                if (request.BranchId != Guid.Empty)
                {
                    doctorBranch = await _doctorRepository.GetDoctorBranchAsync(request.DoctorId.Value, request.BranchId, cancellationToken);
                }

                if (doctorBranch == null)
                {
                    doctorBranch = await _doctorRepository.GetFirstDoctorBranchByDoctorIdAsync(request.DoctorId.Value, cancellationToken);
                }
            }

            // Slot duration in minutes (default 30 mins, or from DoctorBranch)
            int slotDuration = (doctorBranch != null && doctorBranch.SlotDurationMinutes > 0)
                ? doctorBranch.SlotDurationMinutes
                : 30;

            // Working hours
            TimeOnly startTime = new(9, 0);
            TimeOnly endTime = new(17, 0);
            int maxPatients = 0;

            if (doctorBranch != null)
            {
                var schedules = await _doctorRepository.GetDoctorSchedulesAsync(doctorBranch.Id, cancellationToken);
                var daySchedule = schedules.FirstOrDefault(s => s.DayOfWeek == request.Date.DayOfWeek);

                if (daySchedule != null)
                {
                    startTime = daySchedule.StartTime;
                    endTime = daySchedule.EndTime;
                    maxPatients = daySchedule.MaxPatients;
                }
            }

            // Retrieve booked appointments for this doctor on this date
            IReadOnlyList<Appointment> bookedAppointments = Array.Empty<Appointment>();
            if (doctorBranch != null)
            {
                bookedAppointments = await _appointmentRepository.GetAppointmentsByDoctorBranchAsync(doctorBranch.Id, request.Date, cancellationToken);
            }
            else if (request.BranchId != Guid.Empty)
            {
                bookedAppointments = await _appointmentRepository.GetAppointmentsByBranchAsync(request.BranchId, request.Date, null, request.DoctorId, cancellationToken);
            }

            var activeBooked = bookedAppointments
                .Where(a => a.AppointmentStatus != AppointmentStatus.Cancelled && a.AppointmentStatus != AppointmentStatus.NoShow)
                .ToList();

            // Local clinic time
            TimeZoneInfo tz;
            try
            {
                tz = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            }
            catch
            {
                tz = TimeZoneInfo.Local;
            }

            var nowClinic = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
            var todayClinic = DateOnly.FromDateTime(nowClinic.Date);
            var currentClinicTime = TimeOnly.FromDateTime(nowClinic);

            var slots = new List<AvailableTimeSlotDto>();
            var currentSlot = startTime;

            while (currentSlot.AddMinutes(slotDuration) <= endTime)
            {
                var timeStr = currentSlot.ToString("HH:mm");
                var displayTime = DateTime.Today.Add(currentSlot.ToTimeSpan()).ToString("hh:mm tt");

                bool isPast = (request.Date < todayClinic) || (request.Date == todayClinic && currentSlot <= currentClinicTime);
                bool isBooked = activeBooked.Any(a => a.Notes != null && a.Notes.Contains($"[{timeStr}"));
                
                // If capacity is reached
                if (maxPatients > 0 && activeBooked.Count >= maxPatients)
                {
                    isBooked = true;
                }

                slots.Add(new AvailableTimeSlotDto
                {
                    Time = timeStr,
                    DisplayTime = displayTime,
                    IsPast = isPast,
                    IsBooked = isBooked,
                    IsAvailable = !isPast && !isBooked
                });

                currentSlot = currentSlot.AddMinutes(slotDuration);
            }

            return slots;
        }
    }
}
