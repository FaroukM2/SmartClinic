using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class VisitRepository : IVisitRepository
    {
        private readonly SmartClinicDbContext _context;

        public VisitRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddVisitAsync(Visit visit, CancellationToken cancellationToken = default)
        {
            await _context.Visits.AddAsync(visit, cancellationToken);
        }

        public Task UpdateVisitAsync(Visit visit, CancellationToken cancellationToken = default)
        {
            _context.Visits.Update(visit);
            return Task.CompletedTask;
        }

        public async Task<Visit?> GetVisitByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Visits
                .Include(v => v.Appointment)
                    .ThenInclude(a => a.Patient)
                .Include(v => v.Prescription)
                    .ThenInclude(p => p!.PrescriptionItems)
                .Include(v => v.Attachments)
                .Include(v => v.Payment)
                .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        }

        public async Task<Visit?> GetVisitByAppointmentIdAsync(Guid appointmentId, CancellationToken cancellationToken = default)
        {
            return await _context.Visits
                .Include(v => v.Appointment)
                .Include(v => v.Prescription)
                    .ThenInclude(p => p!.PrescriptionItems)
                .Include(v => v.Attachments)
                .Include(v => v.Payment)
                .FirstOrDefaultAsync(v => v.AppointmentId == appointmentId, cancellationToken);
        }

        public async Task<int> GetTodayCompletedCountAsync(Guid clinicId, CancellationToken cancellationToken = default)
        {
            var todayUtc = DateTime.UtcNow.Date;
            return await _context.Visits
                .CountAsync(v => v.Appointment.DoctorBranch.Branch.ClinicId == clinicId
                              && v.Appointment.AppointmentStatus == Domain.Enums.AppointmentStatus.Completed
                              && v.CreatedAt.Date == todayUtc, cancellationToken);
        }
    }
}
