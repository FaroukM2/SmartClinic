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
    public class BranchConfiguration : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            // Table Name
            builder.ToTable("Branches");

            // Primary Key
            builder.HasKey(b => b.Id);

            // Properties
            builder.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(b => b.Address)
                .HasMaxLength(250);

            builder.Property(b => b.Phone)
                .HasMaxLength(20);

            builder.Property(b => b.IsMainBranch)
                .HasDefaultValue(false);

            builder.Property(b => b.IsActive)
                .HasDefaultValue(true);

            // Relationships

            // Many Branches -> One Clinic
            builder.HasOne(b => b.Clinic)
                .WithMany(c => c.Branches)
                .HasForeignKey(b => b.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Branch -> Many Doctor Branches
            builder.HasMany(b => b.DoctorBranches)
                .WithOne(db => db.Branch)
                .HasForeignKey(db => db.BranchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
