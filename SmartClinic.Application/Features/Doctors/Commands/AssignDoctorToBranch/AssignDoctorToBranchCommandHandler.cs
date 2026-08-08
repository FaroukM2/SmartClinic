using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Commands.AssignDoctorToBranch
{
    public class AssignDoctorToBranchCommandHandler : IRequestHandler<AssignDoctorToBranchCommand, bool>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AssignDoctorToBranchCommandHandler(
            IDoctorRepository doctorRepository,
            IUnitOfWork unitOfWork)
        {
            _doctorRepository = doctorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(AssignDoctorToBranchCommand request, CancellationToken cancellationToken)
        {
            var existingDoctorBranch = await _doctorRepository.GetDoctorBranchAsync(
                request.DoctorId,
                request.BranchId,
                cancellationToken);

            if (existingDoctorBranch is not null)
            {
                existingDoctorBranch.ConsultationFee = request.ConsultationFee;
                existingDoctorBranch.FollowUpFee = request.FollowUpFee;
                existingDoctorBranch.FollowUpDaysLimit = request.FollowUpDaysLimit;
                existingDoctorBranch.SlotDurationMinutes = request.SlotDurationMinutes;
                existingDoctorBranch.IsActive = true;

                await _doctorRepository.UpdateDoctorBranchAsync(existingDoctorBranch, cancellationToken);
            }
            else
            {
                var newDoctorBranch = new DoctorBranch
                {
                    DoctorId = request.DoctorId,
                    BranchId = request.BranchId,
                    ConsultationFee = request.ConsultationFee,
                    FollowUpFee = request.FollowUpFee,
                    FollowUpDaysLimit = request.FollowUpDaysLimit,
                    SlotDurationMinutes = request.SlotDurationMinutes,
                    IsActive = true
                };

                await _doctorRepository.AddDoctorBranchAsync(newDoctorBranch, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
