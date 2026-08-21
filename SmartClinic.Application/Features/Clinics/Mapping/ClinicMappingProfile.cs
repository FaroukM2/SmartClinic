using AutoMapper;
using SmartClinic.Application.Features.Clinics.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Clinics.Mapping
{
    public class ClinicMappingProfile : Profile
    {
        public ClinicMappingProfile()
        {
            CreateMap<Clinic, ClinicDto>();
        }
    }
}
