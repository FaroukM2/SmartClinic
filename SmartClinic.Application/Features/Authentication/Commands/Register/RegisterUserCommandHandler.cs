using MediatR;
using SmartClinic.Application.Features.Authentication.Commands.Login;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Authentication.Commands.Register
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterUserCommandHandler(
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

        public async Task<LoginResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser is not null)
                throw new InvalidOperationException("Email is already registered.");

            var passwordHash = _passwordHasher.Hash(request.Password);
            var user = new User
            {
                ClinicId = request.ClinicId,
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = passwordHash,
                PhoneNumber = request.PhoneNumber ?? string.Empty,
                UserType = request.UserType,
                IsActive = true
            };

            var accessToken = _jwtProvider.GenerateToken(user);
            var refreshToken = _jwtProvider.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTimeOffset.UtcNow.AddDays(7);
            user.LastLogin = DateTimeOffset.UtcNow;

            await _userRepository.AddAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new LoginResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60)
            };
        }
    }
}
