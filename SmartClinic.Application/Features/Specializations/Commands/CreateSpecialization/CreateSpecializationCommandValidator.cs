using FluentValidation;

namespace SmartClinic.Application.Features.Specializations.Commands.CreateSpecialization
{
    public class CreateSpecializationCommandValidator : AbstractValidator<CreateSpecializationCommand>
    {
        public CreateSpecializationCommandValidator()
        {
            RuleFor(x => x.ClinicId)
                .NotEmpty().WithMessage("Clinic ID is required.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Specialization name is required.")
                .MaximumLength(100).WithMessage("Specialization name must not exceed 100 characters.");
        }
    }
}
