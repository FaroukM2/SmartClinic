using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Payments.Commands.ProcessPayment
{
    public class ProcessPaymentCommandHandler : IRequestHandler<ProcessPaymentCommand, Guid>
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProcessPaymentCommandHandler(
            IPaymentRepository paymentRepository,
            IUnitOfWork unitOfWork)
        {
            _paymentRepository = paymentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(ProcessPaymentCommand request, CancellationToken cancellationToken)
        {
            var netAmount = request.Amount - request.Discount;
            var receiptNumber = $"REC-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";

            var payment = new Payment
            {
                VisitId = request.VisitId,
                Amount = request.Amount,
                Discount = request.Discount,
                NetAmount = netAmount,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = PaymentStatus.Paid,
                ReceiptNumber = receiptNumber,
                CreatedByUserId = request.CreatedByUserId
            };

            await _paymentRepository.AddPaymentAsync(payment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return payment.Id;
        }
    }
}
