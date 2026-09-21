using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorsByClinic
{
    public sealed record GetDoctorsByClinicQuery(Guid ClinicId) : IRequest<IReadOnlyList<DoctorDto>>;
}
