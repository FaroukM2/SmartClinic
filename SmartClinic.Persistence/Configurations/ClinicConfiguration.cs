using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Configurations
{
    public class ClinicConfiguration : IEntityTypeConfiguration<Clinic>
    {
        public void Configure(EntityTypeBuilder<Clinic> builder)
        {
            // Table Name
            builder.ToTable("Clinics");

            // Primary Key
            builder.HasKey(c => c.Id);

            // Properties
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(c => c.Subdomain)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(c => c.Email)
                .HasMaxLength(100);

            builder.Property(c => c.Phone)
                .HasMaxLength(20);

            builder.Property(c => c.Address)
                .HasMaxLength(250);

            builder.Property(c => c.LogoUrl)
                .HasMaxLength(500);

            builder.Property(c => c.IsActive)
                .HasDefaultValue(true);

            // Unique Index
            builder.HasIndex(c => c.Subdomain)
                .IsUnique();

            // Relationships

            // One Clinic -> Many Branches
            builder.HasMany(c => c.Branches)
                .WithOne(b => b.Clinic)
                .HasForeignKey(b => b.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Clinic -> Many Users
            builder.HasMany(c => c.Users)
                .WithOne(u => u.Clinic)
                .HasForeignKey(u => u.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Clinic -> Many Patients
            builder.HasMany(c => c.Patients)
                .WithOne(p => p.Clinic)
                .HasForeignKey(p => p.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Clinic -> Many Specializations
            builder.HasMany(c => c.Specializations)
                .WithOne(s => s.Clinic)
                .HasForeignKey(s => s.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
