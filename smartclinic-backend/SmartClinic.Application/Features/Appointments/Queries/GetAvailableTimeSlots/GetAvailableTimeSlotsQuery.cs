using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAvailableTimeSlots
{
    public sealed record GetAvailableTimeSlotsQuery(
        Guid BranchId,
        Guid? DoctorId,
        Guid? DoctorBranchId,
        DateOnly Date
    ) : IRequest<IReadOnlyList<AvailableTimeSlotDto>>;
}
