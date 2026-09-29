using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Payments.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Payments.Queries.GetPaymentsByClinicId
{
    public record GetPaymentsByClinicIdQuery(Guid ClinicId) : IRequest<IReadOnlyList<PaymentDto>>;

    public class GetPaymentsByClinicIdQueryHandler : IRequestHandler<GetPaymentsByClinicIdQuery, IReadOnlyList<PaymentDto>>
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public GetPaymentsByClinicIdQueryHandler(IPaymentRepository paymentRepository, IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<PaymentDto>> Handle(GetPaymentsByClinicIdQuery request, CancellationToken cancellationToken)
        {
            var payments = await _paymentRepository.GetPaymentsByClinicIdAsync(request.ClinicId, cancellationToken);
            return _mapper.Map<IReadOnlyList<PaymentDto>>(payments);
        }
    }
}
