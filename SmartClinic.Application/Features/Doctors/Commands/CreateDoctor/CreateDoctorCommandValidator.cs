using FluentValidation;

namespace SmartClinic.Application.Features.Doctors.Commands.CreateDoctor
{
    public class CreateDoctorCommandValidator : AbstractValidator<CreateDoctorCommand>
    {
        public CreateDoctorCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required.");

            RuleFor(x => x.SpecializationId)
                .NotEmpty().WithMessage("Specialization ID is required.");

            RuleFor(x => x.LicenseNumber)
                .NotEmpty().WithMessage("License number is required.")
                .MaximumLength(50).WithMessage("License number must not exceed 50 characters.");

            RuleFor(x => x.YearsOfExperience)
                .GreaterThanOrEqualTo(0).WithMessage("Years of experience cannot be negative.");
        }
    }
}
