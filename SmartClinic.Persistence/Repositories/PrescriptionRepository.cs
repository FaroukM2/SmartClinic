using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly SmartClinicDbContext _context;

        public PrescriptionRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddPrescriptionAsync(Prescription prescription, CancellationToken cancellationToken = default)
        {
            await _context.Prescriptions.AddAsync(prescription, cancellationToken);
        }

        public async Task<Prescription?> GetPrescriptionByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default)
        {
            return await _context.Prescriptions
                .Include(p => p.PrescriptionItems)
                .Include(p => p.Visit)
                    .ThenInclude(v => v.Appointment)
                        .ThenInclude(a => a.Patient)
                .FirstOrDefaultAsync(p => p.VisitId == visitId, cancellationToken);
        }
    }
}
