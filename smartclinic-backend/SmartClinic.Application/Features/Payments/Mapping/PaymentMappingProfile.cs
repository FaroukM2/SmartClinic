using AutoMapper;
using SmartClinic.Application.Features.Payments.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Payments.Mapping
{
    public class PaymentMappingProfile : Profile
    {
        public PaymentMappingProfile()
        {
            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.CreatedByUserName, opt => opt.MapFrom(src => src.CreatedByUser != null ? src.CreatedByUser.FullName : string.Empty));
        }
    }
}
