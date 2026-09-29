using FluentValidation;
using System;

namespace SmartClinic.Application.Features.Appointments.Commands.BookAppointment
{
    public class BookAppointmentCommandValidator : AbstractValidator<BookAppointmentCommand>
    {
        public BookAppointmentCommandValidator()
        {
            RuleFor(x => x.PatientId)
                .NotEmpty().WithMessage("Patient ID is required.");

            RuleFor(x => x)
                .Must(x => x.DoctorBranchId != Guid.Empty || (x.DoctorId.HasValue && x.DoctorId.Value != Guid.Empty))
                .WithMessage("Please select a doctor for the appointment.");

            RuleFor(x => x.AppointmentDate)
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow.Date))
                .WithMessage("Appointment date cannot be in the past.");
        }
    }
}
