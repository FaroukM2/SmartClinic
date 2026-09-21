using MediatR;
using System;

namespace SmartClinic.Application.Features.Doctors.Commands.SetDoctorSchedule
{
    public sealed record SetDoctorScheduleCommand(
        Guid DoctorBranchId,
        DayOfWeek DayOfWeek,
        TimeOnly StartTime,
        TimeOnly EndTime,
        int MaxPatients
    ) : IRequest<Guid>;
}
