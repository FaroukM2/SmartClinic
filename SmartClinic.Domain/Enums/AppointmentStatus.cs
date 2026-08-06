using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Domain.Enums
{
    public enum AppointmentStatus
    {
        Reserved = 1,
        Waiting = 2,
        InConsultation = 3,
        Completed = 4,
        Cancelled = 5,
        NoShow = 6
    }
}
