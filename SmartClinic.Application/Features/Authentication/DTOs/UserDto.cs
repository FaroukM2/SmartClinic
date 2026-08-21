using System;

namespace SmartClinic.Application.Features.Authentication.DTOs
{
    public sealed record UserDto
    {
        public Guid Id { get; init; }
        public string FullName { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string UserType { get; init; } = string.Empty;
        public Guid ClinicId { get; init; }
    }
}
