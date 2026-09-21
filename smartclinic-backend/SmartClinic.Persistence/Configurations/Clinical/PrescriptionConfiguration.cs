using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
    {
        public void Configure(EntityTypeBuilder<Prescription> builder)
        {
            builder.ToTable("Prescriptions");

            builder.HasKey(p => p.Id);

            builder.HasIndex(p => p.VisitId)
                .IsUnique();

            builder.Property(p => p.Notes)
                .HasMaxLength(1000);

            builder.HasOne(p => p.Visit)
                .WithOne(v => v.Prescription)
                .HasForeignKey<Prescription>(p => p.VisitId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
