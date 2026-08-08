using MediatR;
using System;

namespace SmartClinic.Application.Features.Appointments.Commands.BookAppointment
{
    public sealed record BookAppointmentCommand(
        Guid PatientId,
        Guid DoctorBranchId,
        DateOnly AppointmentDate,
        string? Notes,
        bool IsOverriddenByDoctor = false
    ) : IRequest<Guid>;
}
