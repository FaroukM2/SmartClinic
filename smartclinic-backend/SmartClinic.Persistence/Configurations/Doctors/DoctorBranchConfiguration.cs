using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class DoctorBranchConfiguration : IEntityTypeConfiguration<DoctorBranch>
    {
        public void Configure(EntityTypeBuilder<DoctorBranch> builder)
        {
            builder.ToTable("DoctorBranches");

            builder.HasKey(db => db.Id);

            builder.HasIndex(db => new { db.DoctorId, db.BranchId })
                .IsUnique();

            builder.Property(db => db.ConsultationFee)
                .HasPrecision(18, 2);

            builder.Property(db => db.FollowUpFee)
                .HasPrecision(18, 2);

            builder.HasOne(db => db.Doctor)
                .WithMany(d => d.DoctorBranches)
                .HasForeignKey(db => db.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(db => db.Branch)
                .WithMany(b => b.DoctorBranches)
                .HasForeignKey(db => db.BranchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
