using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IVisitRepository
    {
        Task AddVisitAsync(Visit visit, CancellationToken cancellationToken = default);
        Task UpdateVisitAsync(Visit visit, CancellationToken cancellationToken = default);
        Task<Visit?> GetVisitByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Visit?> GetVisitByAppointmentIdAsync(Guid appointmentId, CancellationToken cancellationToken = default);
        Task<int> GetTodayCompletedCountAsync(Guid clinicId, CancellationToken cancellationToken = default);
    }
}
