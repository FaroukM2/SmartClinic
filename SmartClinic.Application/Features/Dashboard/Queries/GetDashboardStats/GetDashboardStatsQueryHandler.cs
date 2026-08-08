using MediatR;
using SmartClinic.Application.Features.Dashboard.DTOs;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IBranchRepository _branchRepository;
        private readonly IDoctorRepository _doctorRepository;

        public GetDashboardStatsQueryHandler(
            IPatientRepository patientRepository,
            IBranchRepository branchRepository,
            IDoctorRepository doctorRepository)
        {
            _patientRepository = patientRepository;
            _branchRepository = branchRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var patients = await _patientRepository.SearchAsync(request.ClinicId, null, cancellationToken);
            var branches = await _branchRepository.GetByClinicIdAsync(request.ClinicId, cancellationToken);

            return new DashboardStatsDto
            {
                TotalPatients = patients.Count,
                ActiveBranchesCount = branches.Count,
                TodayAppointmentsCount = 0,
                CompletedVisitsToday = 0,
                TodayRevenue = 0m,
                ActiveDoctorsCount = 0
            };
        }
    }
}
