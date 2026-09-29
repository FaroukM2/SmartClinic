using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByBranch
{
    public sealed record GetAppointmentsByBranchQuery(
        Guid BranchId,
        DateOnly Date,
        Guid? DoctorId = null,
        Guid? DoctorBranchId = null
    ) : IRequest<IReadOnlyList<AppointmentDto>>;
}
