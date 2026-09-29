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
                .ForMember(dest => dest.CreatedByUserName, opt => opt.MapFrom(src => src.CreatedByUser != null ? src.CreatedByUser.FullName : string.Empty))
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Visit != null && src.Visit.Appointment != null && src.Visit.Appointment.Patient != null ? src.Visit.Appointment.Patient.FullName : string.Empty));
        }
    }
}
