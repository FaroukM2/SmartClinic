using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
    {
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.ToTable("Attachments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.FilePath)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(a => a.FileType)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasOne(a => a.Visit)
                .WithMany(v => v.Attachments)
                .HasForeignKey(a => a.VisitId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
