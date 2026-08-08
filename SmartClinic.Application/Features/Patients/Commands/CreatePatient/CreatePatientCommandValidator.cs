using FluentValidation;
using System;

namespace SmartClinic.Application.Features.Patients.Commands.CreatePatient
{
    public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
    {
        public CreatePatientCommandValidator()
        {
            RuleFor(x => x.ClinicId)
                .NotEmpty().WithMessage("Clinic ID is required.");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(150).WithMessage("Full name must not exceed 150 characters.");

            RuleFor(x => x.PrimaryPhone)
                .NotEmpty().WithMessage("Primary phone is required.")
                .Matches(@"^\+?[0-9]{8,15}$").WithMessage("Invalid primary phone format.");

            RuleFor(x => x.DateOfBirth)
                .LessThan(DateOnly.FromDateTime(DateTime.UtcNow)).WithMessage("Date of birth cannot be in the future.");
        }
    }
}
