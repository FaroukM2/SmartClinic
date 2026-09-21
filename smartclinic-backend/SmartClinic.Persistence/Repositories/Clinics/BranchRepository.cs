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
    public class BranchRepository : IBranchRepository
    {
        private readonly SmartClinicDbContext _context;

        public BranchRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Branch branch, CancellationToken cancellationToken = default)
        {
            await _context.Branches.AddAsync(branch, cancellationToken);
        }

        public Task UpdateAsync(Branch branch, CancellationToken cancellationToken = default)
        {
            _context.Branches.Update(branch);
            return Task.CompletedTask;
        }

        public async Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Branches
                .Include(b => b.Clinic)
                .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Branch>> GetByClinicIdAsync(Guid clinicId, CancellationToken cancellationToken = default)
        {
            return await _context.Branches
                .Where(b => b.ClinicId == clinicId)
                .ToListAsync(cancellationToken);
        }
    }
}
