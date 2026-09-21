using AutoMapper;
using SmartClinic.Application.Features.Visits.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Visits.Mapping
{
    public class VisitMappingProfile : Profile
    {
        public VisitMappingProfile()
        {
            CreateMap<Visit, VisitDto>()
                .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.Appointment != null ? src.Appointment.PatientId : System.Guid.Empty))
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Appointment != null && src.Appointment.Patient != null ? src.Appointment.Patient.FullName : string.Empty))
                .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.Appointment != null && src.Appointment.DoctorBranch != null ? src.Appointment.DoctorBranch.DoctorId : System.Guid.Empty))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Appointment != null && src.Appointment.DoctorBranch != null && src.Appointment.DoctorBranch.Doctor != null && src.Appointment.DoctorBranch.Doctor.User != null ? src.Appointment.DoctorBranch.Doctor.User.FullName : string.Empty))
                .ForMember(dest => dest.HasPrescription, opt => opt.MapFrom(src => src.Prescription != null))
                .ForMember(dest => dest.HasPayment, opt => opt.MapFrom(src => src.Payment != null));
        }
    }
}
