using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface ISpecializationRepository
    {
        Task AddAsync(Specialization specialization, CancellationToken cancellationToken = default);
        Task UpdateAsync(Specialization specialization, CancellationToken cancellationToken = default);
        Task<Specialization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Specialization>> GetAllAsync(Guid clinicId, CancellationToken cancellationToken = default);
    }
}
