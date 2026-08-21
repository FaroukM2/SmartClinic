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
    public class DoctorRepository : IDoctorRepository
    {
        private readonly SmartClinicDbContext _context;

        public DoctorRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Doctor doctor, CancellationToken cancellationToken = default)
        {
            await _context.Doctors.AddAsync(doctor, cancellationToken);
        }

        public Task UpdateAsync(Doctor doctor, CancellationToken cancellationToken = default)
        {
            _context.Doctors.Update(doctor);
            return Task.CompletedTask;
        }

        public async Task<Doctor?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .Include(d => d.DoctorBranches)
                    .ThenInclude(db => db.Branch)
                .Include(d => d.DoctorBranches)
                    .ThenInclude(db => db.DoctorSchedules)
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Doctor>> GetDoctorsByBranchIdAsync(Guid branchId, CancellationToken cancellationToken = default)
        {
            return await _context.DoctorBranches
                .Where(db => db.BranchId == branchId && db.IsActive)
                .Include(db => db.Doctor)
                    .ThenInclude(d => d.User)
                .Include(db => db.Doctor)
                    .ThenInclude(d => d.Specialization)
                .Select(db => db.Doctor)
                .ToListAsync(cancellationToken);
        }

        public async Task<DoctorBranch?> GetDoctorBranchAsync(Guid doctorId, Guid branchId, CancellationToken cancellationToken = default)
        {
            return await _context.DoctorBranches
                .Include(db => db.DoctorSchedules)
                .FirstOrDefaultAsync(db => db.DoctorId == doctorId && db.BranchId == branchId, cancellationToken);
        }

        public async Task AddDoctorBranchAsync(DoctorBranch doctorBranch, CancellationToken cancellationToken = default)
        {
            await _context.DoctorBranches.AddAsync(doctorBranch, cancellationToken);
        }

        public Task UpdateDoctorBranchAsync(DoctorBranch doctorBranch, CancellationToken cancellationToken = default)
        {
            _context.DoctorBranches.Update(doctorBranch);
            return Task.CompletedTask;
        }

        public async Task AddDoctorScheduleAsync(DoctorSchedule schedule, CancellationToken cancellationToken = default)
        {
            await _context.DoctorSchedules.AddAsync(schedule, cancellationToken);
        }

        public async Task<IReadOnlyList<DoctorSchedule>> GetDoctorSchedulesAsync(Guid doctorBranchId, CancellationToken cancellationToken = default)
        {
            return await _context.DoctorSchedules
                .Where(ds => ds.DoctorBranchId == doctorBranchId)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetActiveCountAsync(Guid clinicId, CancellationToken cancellationToken = default)
        {
            return await _context.Doctors
                .CountAsync(d => d.User.ClinicId == clinicId && d.User.IsActive, cancellationToken);
        }
    }
}
