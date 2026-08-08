using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");

            builder.HasKey(p => p.Id);

            builder.HasIndex(p => p.VisitId)
                .IsUnique();

            builder.Property(p => p.Amount)
                .HasPrecision(18, 2);

            builder.Property(p => p.Discount)
                .HasPrecision(18, 2);

            builder.Property(p => p.NetAmount)
                .HasPrecision(18, 2);

            builder.Property(p => p.ReceiptNumber)
                .HasMaxLength(50);

            builder.HasOne(p => p.Visit)
                .WithOne(v => v.Payment)
                .HasForeignKey<Payment>(p => p.VisitId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.CreatedByUser)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
