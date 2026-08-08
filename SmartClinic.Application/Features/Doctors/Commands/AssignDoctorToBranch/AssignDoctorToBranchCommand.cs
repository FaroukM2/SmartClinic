using MediatR;
using System;

namespace SmartClinic.Application.Features.Doctors.Commands.AssignDoctorToBranch
{
    public sealed record AssignDoctorToBranchCommand(
        Guid DoctorId,
        Guid BranchId,
        decimal ConsultationFee,
        decimal FollowUpFee,
        int FollowUpDaysLimit,
        int SlotDurationMinutes
    ) : IRequest<bool>;
}
