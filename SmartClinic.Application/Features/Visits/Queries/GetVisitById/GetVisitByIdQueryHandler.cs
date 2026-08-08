using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Visits.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Visits.Queries.GetVisitById
{
    public class GetVisitByIdQueryHandler : IRequestHandler<GetVisitByIdQuery, VisitDto?>
    {
        private readonly IVisitRepository _visitRepository;
        private readonly IMapper _mapper;

        public GetVisitByIdQueryHandler(IVisitRepository visitRepository, IMapper mapper)
        {
            _visitRepository = visitRepository;
            _mapper = mapper;
        }

        public async Task<VisitDto?> Handle(GetVisitByIdQuery request, CancellationToken cancellationToken)
        {
            var visit = await _visitRepository.GetVisitByIdAsync(request.Id, cancellationToken);
            return visit is null ? null : _mapper.Map<VisitDto>(visit);
        }
    }
}
