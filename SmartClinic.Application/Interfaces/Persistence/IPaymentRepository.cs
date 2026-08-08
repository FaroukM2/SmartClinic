using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IPaymentRepository
    {
        Task AddPaymentAsync(Payment payment, CancellationToken cancellationToken = default);
        Task<Payment?> GetPaymentByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default);
    }
}
