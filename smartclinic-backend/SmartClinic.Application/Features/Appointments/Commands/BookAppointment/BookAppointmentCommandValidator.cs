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

            RuleFor(x => x.DoctorBranchId)
                .NotEmpty().WithMessage("Doctor Branch ID is required.");

            RuleFor(x => x.AppointmentDate)
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow.Date))
                .WithMessage("Appointment date cannot be in the past.");
        }
    }
}
