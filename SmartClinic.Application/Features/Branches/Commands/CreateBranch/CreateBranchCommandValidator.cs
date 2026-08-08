using FluentValidation;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
    {
        public CreateBranchCommandValidator()
        {
            RuleFor(x => x.ClinicId)
                .NotEmpty().WithMessage("Clinic ID is required.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Branch name is required.")
                .MaximumLength(100).WithMessage("Branch name must not exceed 100 characters.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required.")
                .MaximumLength(200).WithMessage("Address must not exceed 200 characters.");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^\+?[0-9]{8,15}$").WithMessage("Invalid phone number format.");
        }
    }
}
