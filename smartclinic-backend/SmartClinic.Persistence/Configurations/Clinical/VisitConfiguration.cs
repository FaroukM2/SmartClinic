using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class VisitConfiguration : IEntityTypeConfiguration<Visit>
    {
        public void Configure(EntityTypeBuilder<Visit> builder)
        {
            builder.ToTable("Visits");

            builder.HasKey(v => v.Id);

            builder.HasIndex(v => v.AppointmentId)
                .IsUnique();

            builder.Property(v => v.ChiefComplaint)
                .HasMaxLength(1000);

            builder.Property(v => v.PhysicalExamination)
                .HasMaxLength(1000);

            builder.Property(v => v.Diagnosis)
                .HasMaxLength(1000);

            builder.Property(v => v.DoctorNotes)
                .HasMaxLength(2000);

            builder.HasOne(v => v.Appointment)
                .WithOne(a => a.Visit)
                .HasForeignKey<Visit>(v => v.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
