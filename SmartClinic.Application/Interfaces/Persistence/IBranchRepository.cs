using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IBranchRepository
    {
        Task AddAsync(Branch branch, CancellationToken cancellationToken = default);
        Task UpdateAsync(Branch branch, CancellationToken cancellationToken = default);
        Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Branch>> GetByClinicIdAsync(Guid clinicId, CancellationToken cancellationToken = default);
    }
}
