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
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            // Table Name
            builder.ToTable("Roles");

            // Primary Key
            builder.HasKey(r => r.Id);

            // Properties

            builder.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(50);

            // Relationships

            // Many Roles -> One Clinic
            builder.HasOne(r => r.Clinic)
                .WithMany(c => c.Roles)
                .HasForeignKey(r => r.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Role -> Many UserRoles
            builder.HasMany(r => r.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique Index
            builder.HasIndex(r => new { r.ClinicId, r.Name })
                .IsUnique();
        }
    }
}
