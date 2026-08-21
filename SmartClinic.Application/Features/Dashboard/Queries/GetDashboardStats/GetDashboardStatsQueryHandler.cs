using MediatR;
using SmartClinic.Application.Features.Dashboard.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IBranchRepository _branchRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IVisitRepository _visitRepository;
        private readonly IPaymentRepository _paymentRepository;

        public GetDashboardStatsQueryHandler(
            IPatientRepository patientRepository,
            IBranchRepository branchRepository,
            IDoctorRepository doctorRepository,
            IAppointmentRepository appointmentRepository,
            IVisitRepository visitRepository,
            IPaymentRepository paymentRepository)
        {
            _patientRepository = patientRepository;
            _branchRepository = branchRepository;
            _doctorRepository = doctorRepository;
            _appointmentRepository = appointmentRepository;
            _visitRepository = visitRepository;
            _paymentRepository = paymentRepository;
        }

        public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var patients = await _patientRepository.SearchAsync(request.ClinicId, null, cancellationToken);
            var branches = await _branchRepository.GetByClinicIdAsync(request.ClinicId, cancellationToken);
            var activeDoctorsCount = await _doctorRepository.GetActiveCountAsync(request.ClinicId, cancellationToken);
            var todayAppointmentsCount = await _appointmentRepository.GetTodayCountAsync(request.ClinicId, today, cancellationToken);
            var completedVisitsToday = await _visitRepository.GetTodayCompletedCountAsync(request.ClinicId, cancellationToken);
            var todayRevenue = await _paymentRepository.GetTodayRevenueAsync(request.ClinicId, cancellationToken);

            return new DashboardStatsDto
            {
                TotalPatients = patients.Count,
                ActiveBranchesCount = branches.Count,
                ActiveDoctorsCount = activeDoctorsCount,
                TodayAppointmentsCount = todayAppointmentsCount,
                CompletedVisitsToday = completedVisitsToday,
                TodayRevenue = todayRevenue
            };
        }
    }
}
