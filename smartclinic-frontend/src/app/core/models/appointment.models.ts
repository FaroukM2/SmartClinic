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
