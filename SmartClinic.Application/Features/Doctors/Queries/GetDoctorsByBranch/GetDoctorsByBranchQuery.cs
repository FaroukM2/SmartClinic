using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using System;
using System.Collections.Generic;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorsByBranch
{
    public sealed record GetDoctorsByBranchQuery(Guid BranchId) : IRequest<IReadOnlyList<DoctorDto>>;
}
