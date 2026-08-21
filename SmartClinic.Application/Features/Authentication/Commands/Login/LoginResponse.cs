using SmartClinic.Application.Features.Authentication.DTOs;
using System;

namespace SmartClinic.Application.Features.Authentication.Commands.Login
{
    public sealed record LoginResponse
    {
        public string Token { get; init; } = string.Empty;
        public string RefreshToken { get; init; } = string.Empty;
        public DateTime Expiration { get; init; }
        public UserDto User { get; init; } = null!;
    }
}
