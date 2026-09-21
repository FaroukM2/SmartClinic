using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Application.Features.Authentication.DTOs;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Authentication.Commands.RegisterPatient
{
    public class RegisterPatientCommandHandler : IRequestHandler<RegisterPatientCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IClinicRepository _clinicRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterPatientCommandHandler(
            IUserRepository userRepository,
            IPatientRepository patientRepository,
            IClinicRepository clinicRepository,
            IPasswordHasher passwordHasher,
            IJwtProvider jwtProvider,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _patientRepository = patientRepository;
            _clinicRepository = clinicRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<LoginResponse> Handle(RegisterPatientCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
                throw new InvalidOperationException("Email is already registered.");

            var targetClinicId = request.ClinicId;
            if (targetClinicId == Guid.Empty)
            {
                var clinics = await _clinicRepository.GetAllAsync(cancellationToken);
                targetClinicId = clinics.FirstOrDefault()?.Id ?? throw new InvalidOperationException("No clinic available in the system.");
            }

            var passwordHash = _passwordHasher.Hash(request.Password);
            var user = new User
            {
                ClinicId = targetClinicId,
                FullName = request.FullName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = passwordHash,
                UserType = UserType.Patient,
                IsActive = true
            };

            await _userRepository.AddAsync(user, cancellationToken);

            var randomNum = Random.Shared.Next(1000, 9999);
            var patient = new Patient
            {
                ClinicId = targetClinicId,
                UserId = user.Id,
                FullName = request.FullName,
                MedicalCode = $"P-{randomNum}",
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                PrimaryPhone = request.PhoneNumber,
                Address = request.Address ?? string.Empty,
                IsActive = true
            };

            await _patientRepository.AddAsync(patient, cancellationToken);

            var token = _jwtProvider.GenerateToken(user);
            var refreshToken = _jwtProvider.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTimeOffset.UtcNow.AddDays(7);
            user.LastLogin = DateTimeOffset.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new LoginResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60),
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    UserType = user.UserType.ToString(),
                    ClinicId = user.ClinicId
                }
            };
        }
    }
}
