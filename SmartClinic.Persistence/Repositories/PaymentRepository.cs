using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly SmartClinicDbContext _context;

        public PaymentRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddPaymentAsync(Payment payment, CancellationToken cancellationToken = default)
        {
            await _context.Payments.AddAsync(payment, cancellationToken);
        }

        public async Task<Payment?> GetPaymentByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default)
        {
            return await _context.Payments
                .Include(p => p.CreatedByUser)
                .FirstOrDefaultAsync(p => p.VisitId == visitId, cancellationToken);
        }
    }
}
