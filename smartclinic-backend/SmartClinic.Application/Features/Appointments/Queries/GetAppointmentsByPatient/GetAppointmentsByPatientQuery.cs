using MediatR;
using SmartClinic.Application.Features.Appointments.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Appointments.Queries.GetAppointmentsByPatient
{
    public sealed record GetAppointmentsByPatientQuery(Guid PatientId) : IRequest<IReadOnlyList<AppointmentDto>>;
}
