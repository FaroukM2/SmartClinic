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
            Console.WriteLine($"[DbInitializer Warning] Migration check: {ex.Message}");
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

        // Ensure Patient User exists
        var patientUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "patient@smartclinic.com");
        if (patientUser == null)
        {
            patientUser = new User
            {
                ClinicId = clinic.Id,
                FullName = "Ahmed Mahmoud (Patient)",
                Email = "patient@smartclinic.com",
                PhoneNumber = "01011122233",
                PasswordHash = passwordHasher.Hash("Patient@123"),
                UserType = UserType.Patient,
                IsActive = true
            };
            await context.Users.AddAsync(patientUser);
            await context.SaveChangesAsync();

            await context.UserRoles.AddAsync(new UserRole { UserId = patientUser.Id, RoleId = patientRole.Id });
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
                new Specialization { ClinicId = clinic.Id, Name = "Dermatology" }
            };
            await context.Specializations.AddRangeAsync(specs);
            await context.SaveChangesAsync();
        }

        var cardioSpec = await context.Specializations.FirstOrDefaultAsync(s => s.Name == "Cardiology");
        var pediaSpec = await context.Specializations.FirstOrDefaultAsync(s => s.Name == "Pediatrics");
        var orthoSpec = await context.Specializations.FirstOrDefaultAsync(s => s.Name == "Orthopedics");
        var dermaSpec = await context.Specializations.FirstOrDefaultAsync(s => s.Name == "Dermatology");

        // Ensure Standard Test Doctor exists: doctor@smartclinic.com
        var doctorUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "doctor@smartclinic.com");
        if (doctorUser == null)
        {
            doctorUser = new User
            {
                ClinicId = clinic.Id,
                FullName = "Dr. Clinic Specialist",
                Email = "doctor@smartclinic.com",
                PhoneNumber = "01000001111",
                PasswordHash = passwordHasher.Hash("Doctor@123"),
                UserType = UserType.Doctor,
                IsActive = true
            };
            await context.Users.AddAsync(doctorUser);
            await context.SaveChangesAsync();

            await context.UserRoles.AddAsync(new UserRole { UserId = doctorUser.Id, RoleId = doctorRole.Id });
            await context.SaveChangesAsync();

            var testDoctor = new Doctor
            {
                Id = doctorUser.Id,
                SpecializationId = cardioSpec?.Id ?? (await context.Specializations.FirstAsync(s => s.ClinicId == clinic.Id)).Id,
                LicenseNumber = "LIC-DOC-2026",
                YearsOfExperience = 10,
                Bio = "Senior consultant in clinical care and medical team coordination."
            };
            await context.Doctors.AddAsync(testDoctor);
            await context.SaveChangesAsync();

            if (mainBranch != null)
            {
                var docBranch = new DoctorBranch
                {
                    DoctorId = testDoctor.Id,
                    BranchId = mainBranch.Id,
                    ConsultationFee = 400m,
                    FollowUpFee = 150m,
                    FollowUpDaysLimit = 14,
                    SlotDurationMinutes = 20,
                    IsActive = true
                };
                await context.DoctorBranches.AddAsync(docBranch);
                await context.SaveChangesAsync();

                await context.DoctorSchedules.AddAsync(new DoctorSchedule
                {
                    DoctorBranchId = docBranch.Id,
                    DayOfWeek = DayOfWeek.Sunday,
                    StartTime = new TimeOnly(9, 0),
                    EndTime = new TimeOnly(17, 0),
                    MaxPatients = 25
                });
                await context.SaveChangesAsync();
            }
        }

        // 6. Ensure 4 Doctors exist
        if (!await context.Doctors.AnyAsync())
        {
            var doctorData = new[]
            {
                new
                {
                    FullName = "Dr. Tamer Hosny",
                    Email = "tamer@smartclinic.com",
                    Phone = "01011112222",
                    SpecId = cardioSpec?.Id ?? Guid.Empty,
                    Title = "Senior Cardiologist",
                    License = "LIC-CARD-2024",
                    Exp = 12,
                    Bio = "Specialized in cardiovascular interventions and echocardiography.",
                    Fee = 450m,
                    FollowUpFee = 150m,
                    Branch = mainBranch
                },
                new
                {
                    FullName = "Dr. Sarah Mansour",
                    Email = "sarah@smartclinic.com",
                    Phone = "01033334444",
                    SpecId = pediaSpec?.Id ?? Guid.Empty,
                    Title = "Consultant Pediatrician",
                    License = "LIC-PED-2025",
                    Exp = 9,
                    Bio = "Expert in pediatric care, child nutrition, and vaccination programs.",
                    Fee = 350m,
                    FollowUpFee = 100m,
                    Branch = mainBranch
                },
                new
                {
                    FullName = "Dr. Omar Farouk",
                    Email = "omar@smartclinic.com",
                    Phone = "01055556666",
                    SpecId = orthoSpec?.Id ?? Guid.Empty,
                    Title = "Orthopedic Surgeon",
                    License = "LIC-ORTH-2023",
                    Exp = 15,
                    Bio = "Specialized in joint replacement, sports injuries, and arthroscopic surgery.",
                    Fee = 500m,
                    FollowUpFee = 200m,
                    Branch = secondBranch
                },
                new
                {
                    FullName = "Dr. Mona El-Sayed",
                    Email = "mona@smartclinic.com",
                    Phone = "01077778888",
                    SpecId = dermaSpec?.Id ?? Guid.Empty,
                    Title = "Dermatologist & Cosmetologist",
                    License = "LIC-DERM-2026",
                    Exp = 8,
                    Bio = "Specialized in medical dermatology, laser therapies, and skin health.",
                    Fee = 400m,
                    FollowUpFee = 150m,
                    Branch = secondBranch
                }
            };

            foreach (var doc in doctorData)
            {
                var docUser = new User
                {
                    ClinicId = clinic.Id,
                    FullName = doc.FullName,
                    Email = doc.Email,
                    PhoneNumber = doc.Phone,
                    PasswordHash = passwordHasher.Hash("Doctor@123"),
                    UserType = UserType.Doctor,
                    IsActive = true
                };
                await context.Users.AddAsync(docUser);
                await context.SaveChangesAsync();

                await context.UserRoles.AddAsync(new UserRole { UserId = docUser.Id, RoleId = doctorRole.Id });

                var doctor = new Doctor
                {
                    Id = docUser.Id,
                    SpecializationId = doc.SpecId,
                    LicenseNumber = doc.License,
                    YearsOfExperience = doc.Exp,
                    Bio = doc.Bio
                };
                await context.Doctors.AddAsync(doctor);
                await context.SaveChangesAsync();

                if (doc.Branch != null)
                {
                    var docBranch = new DoctorBranch
                    {
                        DoctorId = doctor.Id,
                        BranchId = doc.Branch.Id,
                        ConsultationFee = doc.Fee,
                        FollowUpFee = doc.FollowUpFee,
                        FollowUpDaysLimit = 14,
                        SlotDurationMinutes = 20,
                        IsActive = true
                    };
                    await context.DoctorBranches.AddAsync(docBranch);
                    await context.SaveChangesAsync();

                    // Add weekly schedules (e.g., Saturday through Thursday)
                    var schedules = new List<DoctorSchedule>
                    {
                        new DoctorSchedule
                        {
                            DoctorBranchId = docBranch.Id,
                            DayOfWeek = DayOfWeek.Saturday,
                            StartTime = new TimeOnly(10, 0),
                            EndTime = new TimeOnly(18, 0),
                            MaxPatients = 20
                        },
                        new DoctorSchedule
                        {
                            DoctorBranchId = docBranch.Id,
                            DayOfWeek = DayOfWeek.Monday,
                            StartTime = new TimeOnly(10, 0),
                            EndTime = new TimeOnly(18, 0),
                            MaxPatients = 20
                        },
                        new DoctorSchedule
                        {
                            DoctorBranchId = docBranch.Id,
                            DayOfWeek = DayOfWeek.Wednesday,
                            StartTime = new TimeOnly(10, 0),
                            EndTime = new TimeOnly(18, 0),
                            MaxPatients = 20
                        }
                    };
                    await context.DoctorSchedules.AddRangeAsync(schedules);
                    await context.SaveChangesAsync();
                }
            }
        }

        // 7. Ensure 6 Patients exist
        if (!await context.Patients.AnyAsync())
        {
            var patientsData = new[]
            {
                new
                {
                    FullName = "Ahmed Mahmoud",
                    Gender = Gender.Male,
                    DOB = new DateOnly(1990, 5, 12),
                    PrimaryPhone = "01011122233",
                    SecondaryPhone = (string?)"01122233344",
                    Address = "Nasr City, Cairo",
                    Code = "P-1001",
                    Chronic = "None",
                    Allergies = "Penicillin",
                    Surgeries = "Appendectomy (2018)"
                },
                new
                {
                    FullName = "Mariam Youssef",
                    Gender = Gender.Female,
                    DOB = new DateOnly(1995, 8, 22),
                    PrimaryPhone = "01022233344",
                    SecondaryPhone = (string?)null,
                    Address = "Maadi, Cairo",
                    Code = "P-1002",
                    Chronic = "Asthma",
                    Allergies = "Dust, Pollen",
                    Surgeries = "None"
                },
                new
                {
                    FullName = "Khaled Mostafa",
                    Gender = Gender.Male,
                    DOB = new DateOnly(1982, 11, 3),
                    PrimaryPhone = "01033344455",
                    SecondaryPhone = (string?)"01233344455",
                    Address = "Dokki, Giza",
                    Code = "P-1003",
                    Chronic = "Hypertension",
                    Allergies = "None",
                    Surgeries = "Knee Arthroscopy (2021)"
                },
                new
                {
                    FullName = "Nourhan Ali",
                    Gender = Gender.Female,
                    DOB = new DateOnly(1998, 2, 14),
                    PrimaryPhone = "01044455566",
                    SecondaryPhone = (string?)null,
                    Address = "Sheraton, Heliopolis",
                    Code = "P-1004",
                    Chronic = "None",
                    Allergies = "Sulfa drugs",
                    Surgeries = "None"
                },
                new
                {
                    FullName = "Ibrahim Hassan",
                    Gender = Gender.Male,
                    DOB = new DateOnly(1975, 7, 30),
                    PrimaryPhone = "01055566677",
                    SecondaryPhone = (string?)"01555566677",
                    Address = "6th of October City",
                    Code = "P-1005",
                    Chronic = "Type 2 Diabetes, Hypertension",
                    Allergies = "None",
                    Surgeries = "Gallbladder removal (2019)"
                },
                new
                {
                    FullName = "Fatima El-Zahraa",
                    Gender = Gender.Female,
                    DOB = new DateOnly(2001, 9, 18),
                    PrimaryPhone = "01066677788",
                    SecondaryPhone = (string?)null,
                    Address = "Zamalek, Cairo",
                    Code = "P-1006",
                    Chronic = "None",
                    Allergies = "None",
                    Surgeries = "Tonsillectomy (2010)"
                }
            };

            foreach (var p in patientsData)
            {
                var patient = new Patient
                {
                    ClinicId = clinic.Id,
                    MedicalCode = p.Code,
                    FullName = p.FullName,
                    Gender = p.Gender,
                    DateOfBirth = p.DOB,
                    PrimaryPhone = p.PrimaryPhone,
                    SecondaryPhone = p.SecondaryPhone,
                    Address = p.Address,
                    IsActive = true
                };
                await context.Patients.AddAsync(patient);
                await context.SaveChangesAsync();

                var history = new MedicalHistory
                {
                    PatientId = patient.Id,
                    ChronicDiseases = p.Chronic,
                    Allergies = p.Allergies,
                    PastSurgeries = p.Surgeries,
                    Notes = "Initial medical profile recorded."
                };
                await context.MedicalHistories.AddAsync(history);
                await context.SaveChangesAsync();
            }
        }
    }
}