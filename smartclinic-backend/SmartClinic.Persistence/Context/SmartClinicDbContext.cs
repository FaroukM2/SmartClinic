using Microsoft.EntityFrameworkCore;
using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Context
{
    public class SmartClinicDbContext : DbContext
    {
        public SmartClinicDbContext(DbContextOptions<SmartClinicDbContext> options)
            : base(options)
        {
        }

        #region DbSets

        public DbSet<Clinic> Clinics => Set<Clinic>();

        public DbSet<Branch> Branches => Set<Branch>();

        public DbSet<User> Users => Set<User>();

        public DbSet<Role> Roles => Set<Role>();

        public DbSet<UserRole> UserRoles => Set<UserRole>();

        public DbSet<Doctor> Doctors => Set<Doctor>();

        public DbSet<Specialization> Specializations => Set<Specialization>();

        public DbSet<DoctorBranch> DoctorBranches => Set<DoctorBranch>();

        public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();

        public DbSet<Patient> Patients => Set<Patient>();

        public DbSet<MedicalHistory> MedicalHistories => Set<MedicalHistory>();

        public DbSet<Appointment> Appointments => Set<Appointment>();

        public DbSet<Visit> Visits => Set<Visit>();

        public DbSet<Prescription> Prescriptions => Set<Prescription>();

        public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();

        public DbSet<Payment> Payments => Set<Payment>();

        public DbSet<Attachment> Attachments => Set<Attachment>();

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SmartClinicDbContext).Assembly);
        }
    }
}
