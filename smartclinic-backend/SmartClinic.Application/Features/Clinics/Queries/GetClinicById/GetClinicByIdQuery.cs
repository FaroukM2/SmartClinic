using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Clinics.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Clinics.Queries.GetClinicById
{
    public record GetClinicByIdQuery(Guid Id) : IRequest<ClinicDto?>;

    public class GetClinicByIdQueryHandler : IRequestHandler<GetClinicByIdQuery, ClinicDto?>
    {
        private readonly IClinicRepository _clinicRepository;
        private readonly IMapper _mapper;

        public GetClinicByIdQueryHandler(IClinicRepository clinicRepository, IMapper mapper)
        {
            _clinicRepository = clinicRepository;
            _mapper = mapper;
        }

        public async Task<ClinicDto?> Handle(GetClinicByIdQuery request, CancellationToken cancellationToken)
        {
            var clinic = await _clinicRepository.GetByIdAsync(request.Id, cancellationToken);
            return clinic is null ? null : _mapper.Map<ClinicDto>(clinic);
        }
    }
}
