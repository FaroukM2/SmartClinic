using MediatR;
using System;

namespace SmartClinic.Application.Features.Appointments.Commands.BookAppointment
{
    public sealed record BookAppointmentCommand(
        Guid PatientId,
        Guid DoctorBranchId,
        DateOnly AppointmentDate,
        string? Notes,
        Guid? DoctorId = null,
        Guid? BranchId = null,
        string? StartTime = null,
        int? ConsultationType = null,
        bool IsOverriddenByDoctor = false
    ) : IRequest<Guid>;
}
