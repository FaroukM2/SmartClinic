using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("Patients");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.MedicalCode)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(p => p.FullName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(p => p.PrimaryPhone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(p => p.SecondaryPhone)
                .HasMaxLength(20);

            builder.Property(p => p.Address)
                .HasMaxLength(250);

            builder.HasIndex(p => new { p.ClinicId, p.MedicalCode })
                .IsUnique();

            builder.HasOne(p => p.Clinic)
                .WithMany(c => c.Patients)
                .HasForeignKey(p => p.ClinicId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
