using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class ClinicRepository : IClinicRepository
    {
        private readonly SmartClinicDbContext _context;

        public ClinicRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Clinic clinic, CancellationToken cancellationToken = default)
        {
            await _context.Clinics.AddAsync(clinic, cancellationToken);
        }

        public Task UpdateAsync(Clinic clinic, CancellationToken cancellationToken = default)
        {
            _context.Clinics.Update(clinic);
            return Task.CompletedTask;
        }

        public async Task<Clinic?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Clinics
                .Include(c => c.Branches)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Clinic>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Clinics
                .Include(c => c.Branches)
                .ToListAsync(cancellationToken);
        }
    }
}
