using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IPatientRepository
    {
        Task AddAsync(Patient patient, CancellationToken cancellationToken = default);
        Task UpdateAsync(Patient patient, CancellationToken cancellationToken = default);
        Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Patient?> GetByMedicalCodeAsync(string medicalCode, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Patient>> SearchAsync(Guid clinicId, string? searchTerm, CancellationToken cancellationToken = default);
        
        // Medical History
        Task AddOrUpdateMedicalHistoryAsync(MedicalHistory history, CancellationToken cancellationToken = default);
        Task<MedicalHistory?> GetMedicalHistoryByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default);

        // Attachments
        Task AddAttachmentAsync(Attachment attachment, CancellationToken cancellationToken = default);
        Task<Attachment?> GetAttachmentByIdAsync(Guid attachmentId, CancellationToken cancellationToken = default);
        Task DeleteAttachmentAsync(Attachment attachment, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Attachment>> GetAttachmentsByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default);
    }
}
