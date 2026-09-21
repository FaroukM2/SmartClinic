using FluentValidation;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public class CreateDoctorCommandValidator : AbstractValidator<CreateDoctorCommand>
    {
        public CreateDoctorCommandValidator()
        {
            RuleFor(x => x.ClinicId)
                .NotEmpty().WithMessage("Clinic ID is required.");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(150).WithMessage("Full name must not exceed 150 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email address format.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.");

            RuleFor(x => x.SpecializationId)
                .NotEmpty().WithMessage("Specialization ID is required.");

            RuleFor(x => x.LicenseNumber)
                .NotEmpty().WithMessage("License number is required.")
                .MaximumLength(50).WithMessage("License number must not exceed 50 characters.");
        }
    }
}
