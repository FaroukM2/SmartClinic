using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IDoctorRepository
    {
        Task AddAsync(Doctor doctor, CancellationToken cancellationToken = default);
        Task UpdateAsync(Doctor doctor, CancellationToken cancellationToken = default);
        Task<Doctor?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Doctor>> GetDoctorsByBranchIdAsync(Guid branchId, CancellationToken cancellationToken = default);
        Task<DoctorBranch?> GetDoctorBranchAsync(Guid doctorId, Guid branchId, CancellationToken cancellationToken = default);
        Task AddDoctorBranchAsync(DoctorBranch doctorBranch, CancellationToken cancellationToken = default);
        Task UpdateDoctorBranchAsync(DoctorBranch doctorBranch, CancellationToken cancellationToken = default);
        Task AddDoctorScheduleAsync(DoctorSchedule schedule, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<DoctorSchedule>> GetDoctorSchedulesAsync(Guid doctorBranchId, CancellationToken cancellationToken = default);
    }
}
