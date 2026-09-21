using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Prescriptions.Commands.CreatePrescription
{
    public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, System.Guid>
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePrescriptionCommandHandler(
            IPrescriptionRepository prescriptionRepository,
            IUnitOfWork unitOfWork)
        {
            _prescriptionRepository = prescriptionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<System.Guid> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = new Prescription
            {
                VisitId = request.VisitId,
                Notes = request.Notes,
                PrescriptionItems = request.Items.Select(item => new PrescriptionItem
                {
                    MedicineName = item.MedicineName,
                    Dosage = item.Dosage,
                    Frequency = item.Frequency,
                    Duration = item.Duration,
                    Instructions = item.Instructions
                }).ToList()
            };

            await _prescriptionRepository.AddPrescriptionAsync(prescription, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return prescription.Id;
        }
    }
}
