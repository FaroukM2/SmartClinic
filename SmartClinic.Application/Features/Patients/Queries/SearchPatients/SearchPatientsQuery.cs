using MediatR;
using SmartClinic.Application.Features.Patients.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Patients.Queries.SearchPatients
{
    public sealed record SearchPatientsQuery(Guid ClinicId, string? SearchTerm) : IRequest<IReadOnlyList<PatientDto>>;
}
