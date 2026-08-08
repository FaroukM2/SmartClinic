using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Payments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Payments.Queries.GetPaymentByVisitId
{
    public class GetPaymentByVisitIdQueryHandler : IRequestHandler<GetPaymentByVisitIdQuery, PaymentDto?>
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public GetPaymentByVisitIdQueryHandler(IPaymentRepository paymentRepository, IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        public async Task<PaymentDto?> Handle(GetPaymentByVisitIdQuery request, CancellationToken cancellationToken)
        {
            var payment = await _paymentRepository.GetPaymentByVisitIdAsync(request.VisitId, cancellationToken);
            return payment is null ? null : _mapper.Map<PaymentDto>(payment);
        }
    }
}
