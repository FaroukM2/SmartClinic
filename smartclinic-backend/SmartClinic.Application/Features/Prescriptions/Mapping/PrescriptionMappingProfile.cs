using AutoMapper;
using SmartClinic.Application.Features.Prescriptions.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Prescriptions.Mapping
{
    public class PrescriptionMappingProfile : Profile
    {
        public PrescriptionMappingProfile()
        {
            CreateMap<Prescription, PrescriptionDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems));

            CreateMap<PrescriptionItem, PrescriptionItemDto>();
        }
    }
}
