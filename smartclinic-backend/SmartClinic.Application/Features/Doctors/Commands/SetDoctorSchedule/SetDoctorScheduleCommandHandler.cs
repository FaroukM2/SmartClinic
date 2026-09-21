using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Doctors.Commands.SetDoctorSchedule
{
    public class SetDoctorScheduleCommandHandler : IRequestHandler<SetDoctorScheduleCommand, Guid>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SetDoctorScheduleCommandHandler(
            IDoctorRepository doctorRepository,
            IUnitOfWork unitOfWork)
        {
            _doctorRepository = doctorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(SetDoctorScheduleCommand request, CancellationToken cancellationToken)
        {
            var schedule = new DoctorSchedule
            {
                DoctorBranchId = request.DoctorBranchId,
                DayOfWeek = request.DayOfWeek,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                MaxPatients = request.MaxPatients
            };

            await _doctorRepository.AddDoctorScheduleAsync(schedule, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return schedule.Id;
        }
    }
}
