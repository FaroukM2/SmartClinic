using MediatR;
using SmartClinic.Application.Features.Specializations.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Specializations.Queries.GetAllSpecializations
{
    public sealed record GetAllSpecializationsQuery(Guid ClinicId) : IRequest<IReadOnlyList<SpecializationDto>>;
}
