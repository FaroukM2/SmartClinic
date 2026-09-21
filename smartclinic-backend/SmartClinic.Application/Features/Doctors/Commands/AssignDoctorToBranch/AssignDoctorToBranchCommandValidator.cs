using FluentValidation;

namespace SmartClinic.Application.Features.Doctors.Commands.AssignDoctorToBranch
{
    public class AssignDoctorToBranchCommandValidator : AbstractValidator<AssignDoctorToBranchCommand>
    {
        public AssignDoctorToBranchCommandValidator()
        {
            RuleFor(x => x.DoctorId)
                .NotEmpty().WithMessage("Doctor ID is required.");

            RuleFor(x => x.BranchId)
                .NotEmpty().WithMessage("Branch ID is required.");

            RuleFor(x => x.ConsultationFee)
                .GreaterThanOrEqualTo(0).WithMessage("Consultation fee cannot be negative.");

            RuleFor(x => x.FollowUpFee)
                .GreaterThanOrEqualTo(0).WithMessage("Follow-up fee cannot be negative.");

            RuleFor(x => x.FollowUpDaysLimit)
                .GreaterThanOrEqualTo(0).WithMessage("Follow-up days limit cannot be negative.");

            RuleFor(x => x.SlotDurationMinutes)
                .GreaterThan(0).WithMessage("Slot duration must be greater than 0 minutes.");
        }
    }
}
