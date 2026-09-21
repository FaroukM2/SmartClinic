using AutoMapper;
using SmartClinic.Application.Features.Specializations.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Specializations.Mapping
{
    public class SpecializationMappingProfile : Profile
    {
        public SpecializationMappingProfile()
        {
            CreateMap<Specialization, SpecializationDto>();
        }
    }
}
