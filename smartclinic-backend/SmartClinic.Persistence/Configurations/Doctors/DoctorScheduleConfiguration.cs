using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class DoctorScheduleConfiguration : IEntityTypeConfiguration<DoctorSchedule>
    {
        public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
        {
            builder.ToTable("DoctorSchedules");

            builder.HasKey(ds => ds.Id);

            builder.HasOne(ds => ds.DoctorBranch)
                .WithMany(db => db.DoctorSchedules)
                .HasForeignKey(ds => ds.DoctorBranchId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
