using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IClinicRepository
    {
        Task AddAsync(Clinic clinic, CancellationToken cancellationToken = default);
        Task UpdateAsync(Clinic clinic, CancellationToken cancellationToken = default);
        Task<Clinic?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Clinic>> GetAllAsync(CancellationToken cancellationToken = default);
    }
}

