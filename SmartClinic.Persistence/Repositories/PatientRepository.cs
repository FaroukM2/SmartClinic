using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly SmartClinicDbContext _context;

        public PatientRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Patient patient, CancellationToken cancellationToken = default)
        {
            await _context.Patients.AddAsync(patient, cancellationToken);
        }

        public Task UpdateAsync(Patient patient, CancellationToken cancellationToken = default)
        {
            _context.Patients.Update(patient);
            return Task.CompletedTask;
        }

        public async Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Patients
                .Include(p => p.MedicalHistory)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }

        public async Task<Patient?> GetByMedicalCodeAsync(string medicalCode, CancellationToken cancellationToken = default)
        {
            return await _context.Patients
                .Include(p => p.MedicalHistory)
                .FirstOrDefaultAsync(p => p.MedicalCode == medicalCode, cancellationToken);
        }

        public async Task<IReadOnlyList<Patient>> SearchAsync(Guid clinicId, string? searchTerm, CancellationToken cancellationToken = default)
        {
            var query = _context.Patients.Where(p => p.ClinicId == clinicId && p.IsActive);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                query = query.Where(p => p.FullName.ToLower().Contains(term) ||
                                         p.PrimaryPhone.Contains(term) ||
                                         p.MedicalCode.ToLower().Contains(term));
            }

            return await query
                .Include(p => p.MedicalHistory)
                .ToListAsync(cancellationToken);
        }

        public async Task AddOrUpdateMedicalHistoryAsync(MedicalHistory history, CancellationToken cancellationToken = default)
        {
            var existing = await _context.MedicalHistories
                .FirstOrDefaultAsync(mh => mh.PatientId == history.PatientId, cancellationToken);

            if (existing is not null)
            {
                existing.ChronicDiseases = history.ChronicDiseases;
                existing.Allergies = history.Allergies;
                existing.PastSurgeries = history.PastSurgeries;
                existing.Notes = history.Notes;

                _context.MedicalHistories.Update(existing);
            }
            else
            {
                await _context.MedicalHistories.AddAsync(history, cancellationToken);
            }
        }

        public async Task<MedicalHistory?> GetMedicalHistoryByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default)
        {
            return await _context.MedicalHistories
                .FirstOrDefaultAsync(mh => mh.PatientId == patientId, cancellationToken);
        }

        public async Task AddAttachmentAsync(Attachment attachment, CancellationToken cancellationToken = default)
        {
            await _context.Attachments.AddAsync(attachment, cancellationToken);
        }

        public async Task<Attachment?> GetAttachmentByIdAsync(Guid attachmentId, CancellationToken cancellationToken = default)
        {
            return await _context.Attachments
                .FirstOrDefaultAsync(a => a.Id == attachmentId, cancellationToken);
        }

        public Task DeleteAttachmentAsync(Attachment attachment, CancellationToken cancellationToken = default)
        {
            _context.Attachments.Remove(attachment);
            return Task.CompletedTask;
        }

        public async Task<IReadOnlyList<Attachment>> GetAttachmentsByVisitIdAsync(Guid visitId, CancellationToken cancellationToken = default)
        {
            return await _context.Attachments
                .Where(a => a.VisitId == visitId)
                .ToListAsync(cancellationToken);
        }
    }
}
