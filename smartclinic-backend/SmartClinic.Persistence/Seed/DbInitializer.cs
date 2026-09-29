using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SmartClinic.Application.Interfaces.Authentication;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
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
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DbInitializer Warning] Migration check failed: {ex}");
        }

        // 1. Ensure Clinic exists
        var clinic = await context.Clinics.FirstOrDefaultAsync();
        if (clinic == null)
        {
            clinic = new Clinic
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
        }

        // 2. Ensure Roles exist
        var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.ClinicId == clinic.Id && r.Name == "ClinicAdmin");
        if (adminRole == null)
        {
            adminRole = new Role { ClinicId = clinic.Id, Name = "ClinicAdmin" };
            await context.Roles.AddAsync(adminRole);
            await context.SaveChangesAsync();
        }

        var doctorRole = await context.Roles.FirstOrDefaultAsync(r => r.ClinicId == clinic.Id && r.Name == "Doctor");
        if (doctorRole == null)
        {
            doctorRole = new Role { ClinicId = clinic.Id, Name = "Doctor" };
            await context.Roles.AddAsync(doctorRole);
            await context.SaveChangesAsync();
        }

        var receptionistRole = await context.Roles.FirstOrDefaultAsync(r => r.ClinicId == clinic.Id && r.Name == "Receptionist");
        if (receptionistRole == null)
        {
            receptionistRole = new Role { ClinicId = clinic.Id, Name = "Receptionist" };
            await context.Roles.AddAsync(receptionistRole);
            await context.SaveChangesAsync();
        }

        var patientRole = await context.Roles.FirstOrDefaultAsync(r => r.ClinicId == clinic.Id && r.Name == "Patient");
        if (patientRole == null)
        {
            patientRole = new Role { ClinicId = clinic.Id, Name = "Patient" };
            await context.Roles.AddAsync(patientRole);
            await context.SaveChangesAsync();
        }

        // 3. Ensure Admin User exists
        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@smartclinic.com");
        if (adminUser == null)
        {
            adminUser = new User
            {
                ClinicId = clinic.Id,
                FullName = "System Administrator",
                Email = "admin@smartclinic.com",
                PhoneNumber = "01000000000",
                PasswordHash = passwordHasher.Hash("Admin@123"),
                UserType = UserType.ClinicAdmin,
                IsActive = true
            };
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();

            await context.UserRoles.AddAsync(new UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });
            await context.SaveChangesAsync();
        }

        // Ensure Receptionist User exists
        var receptionistUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "receptionist@smartclinic.com");
        if (receptionistUser == null)
        {
            receptionistUser = new User
            {
                ClinicId = clinic.Id,
                FullName = "Front Desk Receptionist",
                Email = "receptionist@smartclinic.com",
                PhoneNumber = "01099887766",
                PasswordHash = passwordHasher.Hash("Reception@123"),
                UserType = UserType.Receptionist,
                IsActive = true
            };
            await context.Users.AddAsync(receptionistUser);
            await context.SaveChangesAsync();

            await context.UserRoles.AddAsync(new UserRole { UserId = receptionistUser.Id, RoleId = receptionistRole.Id });
            await context.SaveChangesAsync();
        }

        // 4. Ensure Branches exist
        if (!await context.Branches.AnyAsync(b => b.ClinicId == clinic.Id))
        {
            var branches = new List<Branch>
            {
                new Branch
                {
                    ClinicId = clinic.Id,
                    Name = "Main Branch - Downtown",
                    Address = "14 El-Galaa St., Cairo",
                    Phone = "0225789001",
                    IsMainBranch = true,
                    IsActive = true
                },
                new Branch
                {
                    ClinicId = clinic.Id,
                    Name = "East Branch - Heliopolis",
                    Address = "28 El-Nozha St., Heliopolis",
                    Phone = "0224156002",
                    IsMainBranch = false,
                    IsActive = true
                }
            };
            await context.Branches.AddRangeAsync(branches);
            await context.SaveChangesAsync();
        }

        var mainBranch = await context.Branches.FirstOrDefaultAsync(b => b.ClinicId == clinic.Id && b.IsMainBranch);
        var secondBranch = await context.Branches.FirstOrDefaultAsync(b => b.ClinicId == clinic.Id && !b.IsMainBranch) ?? mainBranch;

        // 5. Ensure Specializations exist
        if (!await context.Specializations.AnyAsync(s => s.ClinicId == clinic.Id))
        {
            var specs = new List<Specialization>
            {
                new Specialization { ClinicId = clinic.Id, Name = "Cardiology" },
                new Specialization { ClinicId = clinic.Id, Name = "Pediatrics" },
                new Specialization { ClinicId = clinic.Id, Name = "Orthopedics" },
                new Specialization { ClinicId = clinic.Id, Name = "Dermatology" },
                new Specialization { ClinicId = clinic.Id, Name = "Internal Medicine" },
                new Specialization { ClinicId = clinic.Id, Name = "General Surgery" }
            };
            await context.Specializations.AddRangeAsync(specs);
            await context.SaveChangesAsync();
        }

        // Mock data for Doctors, Schedules, and Patients removed per user request.
        // The user can now add branches, doctors, schedules, and patients from scratch.
    }
}