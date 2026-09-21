using FluentValidation;

namespace SmartClinic.Application.Features.Payments.Commands.ProcessPayment
{
    public class ProcessPaymentCommandValidator : AbstractValidator<ProcessPaymentCommand>
    {
        public ProcessPaymentCommandValidator()
        {
            RuleFor(x => x.VisitId)
                .NotEmpty().WithMessage("Visit ID is required.");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Payment amount must be greater than 0.");

            RuleFor(x => x.Discount)
                .GreaterThanOrEqualTo(0).WithMessage("Discount cannot be negative.");

            RuleFor(x => x.CreatedByUserId)
                .NotEmpty().WithMessage("Created by user ID is required.");
        }
    }
}
