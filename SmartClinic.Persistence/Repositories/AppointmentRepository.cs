using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly SmartClinicDbContext _context;

        public AppointmentRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAppointmentAsync(Appointment appointment, CancellationToken cancellationToken = default)
        {
            await _context.Appointments.AddAsync(appointment, cancellationToken);
        }

        public Task UpdateAppointmentAsync(Appointment appointment, CancellationToken cancellationToken = default)
        {
            _context.Appointments.Update(appointment);
            return Task.CompletedTask;
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.DoctorBranch)
                    .ThenInclude(db => db.Doctor)
                        .ThenInclude(d => d.User)
                .Include(a => a.Visit)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<int> GetNextQueueNumberAsync(Guid doctorBranchId, DateOnly appointmentDate, CancellationToken cancellationToken = default)
        {
            var maxQueue = await _context.Appointments
                .Where(a => a.DoctorBranchId == doctorBranchId && a.AppointmentDate == appointmentDate)
                .MaxAsync(a => (int?)a.QueueNumber, cancellationToken);

            return (maxQueue ?? 0) + 1;
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByDoctorBranchAsync(Guid doctorBranchId, DateOnly date, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .Where(a => a.DoctorBranchId == doctorBranchId && a.AppointmentDate == date)
                .Include(a => a.Patient)
                .Include(a => a.Visit)
                .OrderBy(a => a.QueueNumber)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsByPatientAsync(Guid patientId, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Include(a => a.DoctorBranch)
                    .ThenInclude(db => db.Doctor)
                        .ThenInclude(d => d.User)
                .Include(a => a.Visit)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync(cancellationToken);
        }
    }
}
