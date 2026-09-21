using MediatR;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUnitOfWork _unitOfWork;

        public CreateDoctorCommandHandler(
            IUserRepository userRepository,
            IDoctorRepository doctorRepository,
            IPasswordHasher passwordHasher,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _doctorRepository = doctorRepository;
            _passwordHasher = passwordHasher;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (user == null)
            {
                user = new User
                {
                    ClinicId = request.ClinicId,
                    FullName = request.FullName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    PasswordHash = _passwordHasher.Hash("Doctor@123"),
                    UserType = UserType.Doctor,
                    IsActive = true
                };

                await _userRepository.AddAsync(user, cancellationToken);
            }

            var doctor = new Doctor
            {
                Id = user.Id,
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
