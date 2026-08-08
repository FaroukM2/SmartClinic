using MediatR;
using SmartClinic.Application.Features.Patients.DTOs;
using System;

namespace SmartClinic.Application.Features.Patients.Queries.GetPatientById
{
    public sealed record GetPatientByIdQuery(Guid Id) : IRequest<PatientDto?>;
}
