using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Infrastructure.Authentication;
using SmartClinic.Infrastructure.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Infrastructure.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<JwtSettings>(
                configuration.GetSection(JwtSettings.SectionName));

            services.AddScoped<IPasswordHasher, PasswordHasher>();

            services.AddScoped<IJwtProvider, JwtProvider>();

            services.AddHttpContextAccessor();
            services.AddScoped<SmartClinic.Application.Interfaces.Services.ICurrentUserService, SmartClinic.Infrastructure.Services.CurrentUserService>();

            services.AddJwtAuthentication(configuration);

            return services;
        }
    }
}
