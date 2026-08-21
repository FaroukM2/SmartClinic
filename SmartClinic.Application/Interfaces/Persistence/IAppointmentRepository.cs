using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IAppointmentRepository
    {
        Task AddAppointmentAsync(Appointment appointment, CancellationToken cancellationToken = default);
        Task UpdateAppointmentAsync(Appointment appointment, CancellationToken cancellationToken = default);
        Task<Appointment?> GetAppointmentByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<int> GetNextQueueNumberAsync(Guid doctorBranchId, DateOnly appointmentDate, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Appointment>> GetAppointmentsByDoctorBranchAsync(Guid doctorBranchId, DateOnly date, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Appointment>> GetAppointmentsByPatientAsync(Guid patientId, CancellationToken cancellationToken = default);
        Task<int> GetTodayCountAsync(Guid clinicId, DateOnly date, CancellationToken cancellationToken = default);
    }
}
