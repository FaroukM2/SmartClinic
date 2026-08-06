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
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Table Name
            builder.ToTable("Users");

            // Primary Key
            builder.HasKey(u => u.Id);

            // Properties

            builder.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.PhoneNumber)
                .HasMaxLength(20);

            builder.Property(u => u.PasswordHash)
                .IsRequired();

            builder.Property(u => u.UserType)
                .IsRequired();

            builder.Property(u => u.IsActive)
                .HasDefaultValue(true);

            builder.Property(u => u.RefreshToken);

            builder.Property(u => u.RefreshTokenExpiry);

            // Unique Index

            builder.HasIndex(u => u.Email)
                .IsUnique();

            // Relationships

            // Many Users -> One Clinic
            builder.HasOne(u => u.Clinic)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One User -> One Doctor
            builder.HasOne(u => u.Doctor)
                .WithOne(d => d.User)
                .HasForeignKey<Doctor>(d => d.Id)
                .OnDelete(DeleteBehavior.Restrict);

            // One User -> Many UserRoles
            builder.HasMany(u => u.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One User -> Many Payments
            builder.HasMany(u => u.Payments)
                .WithOne(p => p.CreatedByUser)
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
