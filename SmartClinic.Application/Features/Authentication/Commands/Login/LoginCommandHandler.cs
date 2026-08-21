using MediatR;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Application.Interfaces.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Authentication.Commands.Login
{
    public class LoginCommandHandler
        : IRequestHandler<LoginCommand, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public LoginCommandHandler(
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

        public async Task<LoginResponse> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            // Get user by email
            var user = await _userRepository.GetByEmailAsync(
                request.Email,
                cancellationToken);

            if (user is null)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Check if account is active
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Your account is inactive.");
            }

            // Verify password
            var isPasswordValid = _passwordHasher.Verify(
                request.Password,
                user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Generate JWT & Refresh Token
            var accessToken = _jwtProvider.GenerateToken(user);
            var refreshToken = _jwtProvider.GenerateRefreshToken();

            // Update user information
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTimeOffset.UtcNow.AddDays(7);
            user.LastLogin = DateTimeOffset.UtcNow;

            await _userRepository.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Return response
            return new LoginResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60),
                User = new SmartClinic.Application.Features.Authentication.DTOs.UserDto
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
