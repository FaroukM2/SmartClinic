using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Prescriptions.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Prescriptions.Queries.GetPrescriptionByVisitId
{
    public class GetPrescriptionByVisitIdQueryHandler : IRequestHandler<GetPrescriptionByVisitIdQuery, PrescriptionDto?>
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IMapper _mapper;

        public GetPrescriptionByVisitIdQueryHandler(IPrescriptionRepository prescriptionRepository, IMapper mapper)
        {
            _prescriptionRepository = prescriptionRepository;
            _mapper = mapper;
        }

        public async Task<PrescriptionDto?> Handle(GetPrescriptionByVisitIdQuery request, CancellationToken cancellationToken)
        {
            var prescription = await _prescriptionRepository.GetPrescriptionByVisitIdAsync(request.VisitId, cancellationToken);
            return prescription is null ? null : _mapper.Map<PrescriptionDto>(prescription);
        }
    }
}
