using FluentValidation;

namespace SmartClinic.Application.Features.Prescriptions.Commands.CreatePrescription
{
    public class CreatePrescriptionCommandValidator : AbstractValidator<CreatePrescriptionCommand>
    {
        public CreatePrescriptionCommandValidator()
        {
            RuleFor(x => x.VisitId)
                .NotEmpty().WithMessage("Visit ID is required.");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one medicine item is required.");
        }
    }
}
