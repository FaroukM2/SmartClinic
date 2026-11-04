using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Patients.Commands.CreatePatient
{
    public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, Guid>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IClinicRepository _clinicRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePatientCommandHandler(
            IPatientRepository patientRepository,
            IClinicRepository clinicRepository,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _clinicRepository = clinicRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
        {
            var targetClinicId = request.ClinicId;
            var clinicExists = targetClinicId != Guid.Empty && await _clinicRepository.GetByIdAsync(targetClinicId, cancellationToken) != null;
            if (!clinicExists)
            {
                var clinics = await _clinicRepository.GetAllAsync(cancellationToken);
                targetClinicId = clinics.FirstOrDefault()?.Id ?? throw new InvalidOperationException("No clinic available in the system.");
            }

            var medicalCode = $"P-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";

            var patient = new Patient
            {
                ClinicId = targetClinicId,
                MedicalCode = medicalCode,
                FullName = request.FullName,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                PrimaryPhone = request.PrimaryPhone,
                SecondaryPhone = request.SecondaryPhone,
                Address = request.Address,
                IsActive = true
            };

            await _patientRepository.AddAsync(patient, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return patient.Id;
        }
    }
}
