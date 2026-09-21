using MediatR;
using SmartClinic.Domain.Enums;
using System;

namespace SmartClinic.Application.Features.Appointments.Commands.ChangeAppointmentStatus
{
    public sealed record ChangeAppointmentStatusCommand(
        Guid AppointmentId,
        AppointmentStatus Status
    ) : IRequest<bool>;
}
