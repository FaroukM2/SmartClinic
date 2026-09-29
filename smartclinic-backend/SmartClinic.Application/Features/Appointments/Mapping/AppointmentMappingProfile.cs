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
                .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorBranch != null ? (System.Guid?)src.DoctorBranch.DoctorId : null))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.DoctorBranch != null && src.DoctorBranch.Doctor != null && src.DoctorBranch.Doctor.User != null ? src.DoctorBranch.Doctor.User.FullName : string.Empty))
                .ForMember(dest => dest.SpecializationName, opt => opt.MapFrom(src => src.DoctorBranch != null && src.DoctorBranch.Doctor != null && src.DoctorBranch.Doctor.Specialization != null ? src.DoctorBranch.Doctor.Specialization.Name : string.Empty))
                .ForMember(dest => dest.BranchName, opt => opt.MapFrom(src => src.DoctorBranch != null && src.DoctorBranch.Branch != null ? src.DoctorBranch.Branch.Name : string.Empty))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => ExtractStartTime(src.Notes)))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => CleanNotes(src.Notes)))
                .ForMember(dest => dest.VisitId, opt => opt.MapFrom(src => src.Visit != null ? (System.Guid?)src.Visit.Id : null));
        }

        private static string? ExtractStartTime(string? notes)
        {
            if (string.IsNullOrWhiteSpace(notes)) return null;
            if (notes.StartsWith("[") && notes.Contains("]"))
            {
                var endIdx = notes.IndexOf(']');
                return notes.Substring(1, endIdx - 1).Trim();
            }
            return null;
        }

        private static string? CleanNotes(string? notes)
        {
            if (string.IsNullOrWhiteSpace(notes)) return notes;
            if (notes.StartsWith("[") && notes.Contains("]"))
            {
                var endIdx = notes.IndexOf(']');
                var rest = notes.Substring(endIdx + 1).Trim();
                return string.IsNullOrWhiteSpace(rest) ? null : rest;
            }
            return notes;
        }
    }
}
