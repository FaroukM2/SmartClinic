using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, Guid>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateDoctorCommandHandler(
            IDoctorRepository doctorRepository,
            IUnitOfWork unitOfWork)
        {
            _doctorRepository = doctorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
        {
            var doctor = new Doctor
            {
                Id = request.UserId,
                SpecializationId = request.SpecializationId,
                LicenseNumber = request.LicenseNumber,
                YearsOfExperience = request.YearsOfExperience,
                Bio = request.Bio
            };

            await _doctorRepository.AddAsync(doctor, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return doctor.Id;
        }
    }
}
