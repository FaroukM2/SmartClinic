using AutoMapper;
using SmartClinic.Application.Features.Doctors.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Doctors.Mapping
{
    public class DoctorMappingProfile : Profile
    {
        public DoctorMappingProfile()
        {
            CreateMap<Doctor, DoctorDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : string.Empty))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User != null ? src.User.Email : string.Empty))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User != null ? src.User.PhoneNumber ?? string.Empty : string.Empty))
                .ForMember(dest => dest.SpecializationName, opt => opt.MapFrom(src => src.Specialization != null ? src.Specialization.Name : string.Empty))
                .ForMember(dest => dest.Branches, opt => opt.MapFrom(src => src.DoctorBranches));

            CreateMap<DoctorBranch, DoctorBranchDto>()
                .ForMember(dest => dest.BranchName, opt => opt.MapFrom(src => src.Branch != null ? src.Branch.Name : string.Empty))
                .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.DoctorSchedules));

            CreateMap<DoctorSchedule, DoctorScheduleDto>();
        }
    }
}
