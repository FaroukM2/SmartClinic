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
    public class SpecializationRepository : ISpecializationRepository
    {
        private readonly SmartClinicDbContext _context;

        public SpecializationRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Specialization specialization, CancellationToken cancellationToken = default)
        {
            await _context.Specializations.AddAsync(specialization, cancellationToken);
        }

        public Task UpdateAsync(Specialization specialization, CancellationToken cancellationToken = default)
        {
            _context.Specializations.Update(specialization);
            return Task.CompletedTask;
        }

        public async Task<Specialization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Specializations
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Specialization>> GetAllAsync(Guid clinicId, CancellationToken cancellationToken = default)
        {
            return await _context.Specializations
                .Where(s => s.ClinicId == clinicId)
                .ToListAsync(cancellationToken);
        }
    }
}
