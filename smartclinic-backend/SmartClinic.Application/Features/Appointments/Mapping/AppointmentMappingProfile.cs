using AutoMapper;
using SmartClinic.Application.Features.Appointments.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Appointments.Mapping
{
    public class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient != null ? src.Patient.FullName : string.Empty))
                .ForMember(dest => dest.PatientPhone, opt => opt.MapFrom(src => src.Patient != null ? src.Patient.PrimaryPhone : string.Empty))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.DoctorBranch != null && src.DoctorBranch.Doctor != null && src.DoctorBranch.Doctor.User != null ? src.DoctorBranch.Doctor.User.FullName : string.Empty))
                .ForMember(dest => dest.BranchName, opt => opt.MapFrom(src => src.DoctorBranch != null && src.DoctorBranch.Branch != null ? src.DoctorBranch.Branch.Name : string.Empty))
                .ForMember(dest => dest.VisitId, opt => opt.MapFrom(src => src.Visit != null ? (System.Guid?)src.Visit.Id : null));
        }
    }
}
