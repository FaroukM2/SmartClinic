export interface AvailableTimeSlot {
  time: string;
  displayTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  isPast: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  patientMedicalCode?: string;
  patientPhone?: string;
  doctorBranchId: string;
  doctorId?: string;
  doctorName?: string;
  specializationName?: string;
  branchName?: string;
  appointmentDate: string;
  startTime?: string;
  appointmentStatus: number;
  statusLabel?: string;
  queueNumber?: number;
  notes?: string;
  clinicId?: string;
  createdOn?: string;
}

export interface BookAppointmentRequest {
  patientId: string;
  doctorBranchId?: string;
  doctorId?: string;
  branchId?: string;
  appointmentDate: string;
  startTime?: string;
  notes?: string;
  consultationType?: number;
}

export interface ChangeAppointmentStatusRequest {
  appointmentId: string;
  newStatus: number;
}

export const AppointmentStatusLabels: Record<number, string> = {
  1: 'Reserved',
  2: 'Waiting',
  3: 'In Consultation',
  4: 'Completed',
  5: 'Cancelled',
  6: 'No Show'
};

export const AppointmentStatusBadge: Record<number, string> = {
  1: 'info',
  2: 'warning',
  3: 'primary',
  4: 'success',
  5: 'danger',
  6: 'secondary'
};

export const ConsultationTypes = [
  { id: 1, name: 'كشف عادي (Regular Examination)', feeMultiplier: 1.0 },
  { id: 2, name: 'إعادة كشف / استشارة (Follow-Up)', feeMultiplier: 0.5 }
];
