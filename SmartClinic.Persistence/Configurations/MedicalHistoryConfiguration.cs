using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class MedicalHistoryConfiguration : IEntityTypeConfiguration<MedicalHistory>
    {
        public void Configure(EntityTypeBuilder<MedicalHistory> builder)
        {
            builder.ToTable("MedicalHistories");

            builder.HasKey(mh => mh.Id);

            builder.HasIndex(mh => mh.PatientId)
                .IsUnique();

            builder.Property(mh => mh.ChronicDiseases)
                .HasMaxLength(1000);

            builder.Property(mh => mh.Allergies)
                .HasMaxLength(1000);

            builder.Property(mh => mh.PastSurgeries)
                .HasMaxLength(1000);

            builder.Property(mh => mh.Notes)
                .HasMaxLength(2000);

            builder.HasOne(mh => mh.Patient)
                .WithOne(p => p.MedicalHistory)
                .HasForeignKey<MedicalHistory>(mh => mh.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
