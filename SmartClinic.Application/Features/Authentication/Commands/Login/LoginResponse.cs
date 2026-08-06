using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Authentication.Commands.Login
{
    public sealed record LoginResponse
    {
        public string Token { get; init; } = string.Empty;

        public string RefreshToken { get; init; } = string.Empty;

        public DateTime Expiration { get; init; }
    }
}
