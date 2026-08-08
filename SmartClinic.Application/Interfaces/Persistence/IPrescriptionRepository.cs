using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IPrescriptionRepository
    {
        Task AddPrescriptionAsync(Prescription prescription, CancellationToken cancellationToken = default);
        Task<Prescription?> GetPrescriptionByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default);
    }
}
