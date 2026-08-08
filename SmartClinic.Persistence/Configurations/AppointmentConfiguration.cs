using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.AppointmentStatus)
                .IsRequired();

            builder.Property(a => a.Notes)
                .HasMaxLength(500);

            builder.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.DoctorBranch)
                .WithMany(db => db.Appointments)
                .HasForeignKey(a => a.DoctorBranchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
