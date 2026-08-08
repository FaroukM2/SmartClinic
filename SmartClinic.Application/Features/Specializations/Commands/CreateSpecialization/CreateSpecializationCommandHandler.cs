using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Specializations.Commands.CreateSpecialization
{
    public class CreateSpecializationCommandHandler : IRequestHandler<CreateSpecializationCommand, Guid>
    {
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateSpecializationCommandHandler(
            ISpecializationRepository specializationRepository,
            IUnitOfWork unitOfWork)
        {
            _specializationRepository = specializationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateSpecializationCommand request, CancellationToken cancellationToken)
        {
            var specialization = new Specialization
            {
                ClinicId = request.ClinicId,
                Name = request.Name
            };

            await _specializationRepository.AddAsync(specialization, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return specialization.Id;
        }
    }
}
