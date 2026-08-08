export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  patientMedicalCode?: string;
  doctorBranchId: string;
  doctorName?: string;
  branchName?: string;
  appointmentDate: string;
  startTime?: string;
  appointmentStatus: number;
  statusLabel?: string;
  queueNumber?: number;
  notes?: string;
  createdOn: string;
}

export interface BookAppointmentRequest {
  patientId: string;
  doctorBranchId: string;
  appointmentDate: string;
  startTime?: string;
  notes?: string;
}

export interface ChangeAppointmentStatusRequest {
  appointmentId: string;
  newStatus: number;
}

export const AppointmentStatusLabels: Record<number, string> = {
  0: 'Scheduled',
  1: 'In Queue',
  2: 'In Consultation',
  3: 'Completed',
  4: 'Cancelled',
  5: 'No Show'
};

export const AppointmentStatusBadge: Record<number, string> = {
  0: 'info',
  1: 'warning',
  2: 'primary',
  3: 'success',
  4: 'danger',
  5: 'secondary'
};
