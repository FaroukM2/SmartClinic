using FluentValidation;
using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Clinics.Commands.CreateClinic
{
    public record CreateClinicCommand(
        string Name,
        string Subdomain,
        string Email,
        string Phone,
        string Address
    ) : IRequest<Guid>;

    public class CreateClinicCommandValidator : AbstractValidator<CreateClinicCommand>
    {
        public CreateClinicCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Subdomain).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Address).NotEmpty().MaximumLength(250);
        }
    }

    public class CreateClinicCommandHandler : IRequestHandler<CreateClinicCommand, Guid>
    {
        private readonly IClinicRepository _clinicRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateClinicCommandHandler(IClinicRepository clinicRepository, IUnitOfWork unitOfWork)
        {
            _clinicRepository = clinicRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateClinicCommand request, CancellationToken cancellationToken)
        {
            var clinic = new Clinic
            {
                Name = request.Name,
                Subdomain = request.Subdomain.ToLowerInvariant(),
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                IsActive = true
            };

            await _clinicRepository.AddAsync(clinic, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return clinic.Id;
        }
    }
}
