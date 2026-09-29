namespace SmartClinic.Application.Features.Appointments.DTOs
{
    public class AvailableTimeSlotDto
    {
        public string Time { get; set; } = string.Empty;
        public string DisplayTime { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public bool IsBooked { get; set; }
        public bool IsPast { get; set; }
    }
}
