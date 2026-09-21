using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Application.Features.Authentication.DTOs;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Authentication.Commands.ActivateDoctor
{
    public class ActivateDoctorCommandHandler : IRequestHandler<ActivateDoctorCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public ActivateDoctorCommandHandler(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtProvider jwtProvider,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<LoginResponse> Handle(ActivateDoctorCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (user == null || user.UserType != UserType.Doctor)
            {
                throw new InvalidOperationException("This email is not registered as a doctor by clinic administration. Please contact your clinic manager.");
            }

            user.PasswordHash = _passwordHasher.Hash(request.Password);
            user.IsActive = true;

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
