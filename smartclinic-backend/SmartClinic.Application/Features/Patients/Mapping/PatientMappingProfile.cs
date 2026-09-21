using AutoMapper;
using SmartClinic.Application.Features.Patients.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Patients.Mapping
{
    public class PatientMappingProfile : Profile
    {
        public PatientMappingProfile()
        {
            CreateMap<Patient, PatientDto>();
            CreateMap<MedicalHistory, MedicalHistoryDto>();
            CreateMap<Attachment, AttachmentDto>();
        }
    }
}
