using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Patients.Commands.AddOrUpdateMedicalHistory
{
    public class AddOrUpdateMedicalHistoryCommandHandler : IRequestHandler<AddOrUpdateMedicalHistoryCommand, bool>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddOrUpdateMedicalHistoryCommandHandler(
            IPatientRepository patientRepository,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(AddOrUpdateMedicalHistoryCommand request, CancellationToken cancellationToken)
        {
            var history = new MedicalHistory
            {
                PatientId = request.PatientId,
                ChronicDiseases = request.ChronicDiseases,
                Allergies = request.Allergies,
                PastSurgeries = request.PastSurgeries,
                Notes = request.Notes
            };

            await _patientRepository.AddOrUpdateMedicalHistoryAsync(history, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
