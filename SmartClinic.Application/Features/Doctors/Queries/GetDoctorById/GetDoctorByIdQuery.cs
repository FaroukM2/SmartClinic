using MediatR;
using SmartClinic.Application.Features.Doctors.DTOs;
using System;

namespace SmartClinic.Application.Features.Doctors.Queries.GetDoctorById
{
    public sealed record GetDoctorByIdQuery(Guid Id) : IRequest<DoctorDto?>;
}
