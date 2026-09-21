using System;

namespace SmartClinic.Application.Features.Dashboard.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalPatients { get; set; }
        public int TodayAppointmentsCount { get; set; }
        public int CompletedVisitsToday { get; set; }
        public decimal TodayRevenue { get; set; }
        public int ActiveDoctorsCount { get; set; }
        public int ActiveBranchesCount { get; set; }
    }
}
