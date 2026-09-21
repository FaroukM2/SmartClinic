using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Application.Interfaces.Authentication
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);

        string GenerateRefreshToken();
    }
}
