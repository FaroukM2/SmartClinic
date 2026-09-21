using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByDoctorBranch
{
    public sealed record GetAppointmentsByDoctorBranchQuery(
        Guid DoctorBranchId,
        DateOnly Date
    ) : IRequest<IReadOnlyList<AppointmentDto>>;
}
