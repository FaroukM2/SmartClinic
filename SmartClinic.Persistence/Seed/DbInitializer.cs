using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using SmartClinic.Persistence.Context;
using System;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<SmartClinicDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        try
        {
            await context.Database.EnsureCreatedAsync();
        }
        catch
        {
            // Database might already exist or connection pending
        }

        if (await context.Users.AnyAsync())
            return;

        // Clinic
        var clinic = new Clinic
        {
            Name = "Smart Clinic",
            Subdomain = "smartclinic",
            Email = "info@smartclinic.com",
            Phone = "01000000000",
            Address = "Zagazig, Egypt",
            IsActive = true
        };

        await context.Clinics.AddAsync(clinic);
        await context.SaveChangesAsync();

        // Role
        var role = new Role
        {
            ClinicId = clinic.Id,
            Name = "ClinicAdmin"
        };

        await context.Roles.AddAsync(role);
        await context.SaveChangesAsync();

        // User
        var user = new User
        {
            ClinicId = clinic.Id,
            FullName = "System Administrator",
            Email = "admin@smartclinic.com",
            PhoneNumber = "01000000000",
            PasswordHash = passwordHasher.Hash("Admin@123"),
            UserType = UserType.ClinicAdmin,
            IsActive = true
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        // UserRole
        var userRole = new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id
        };

        await context.UserRoles.AddAsync(userRole);
        await context.SaveChangesAsync();
    }
}