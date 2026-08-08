using AutoMapper;
using SmartClinic.Application.Features.Branches.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Branches.Mapping
{
    public class BranchMappingProfile : Profile
    {
        public BranchMappingProfile()
        {
            CreateMap<Branch, BranchDto>();
        }
    }
}
