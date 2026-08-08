export interface DashboardStats {
  totalPatients: number;
  todayAppointmentsCount: number;
  completedVisitsToday: number;
  todayRevenue: number;
  activeDoctorsCount: number;
  activeBranchesCount: number;
}

export interface Visit {
  id: string;
  appointmentId: string;
  patientName?: string;
  doctorName?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  visitStatus: number;
  startedAt?: string;
  completedAt?: string;
}

export interface Prescription {
  id: string;
  visitId: string;
  notes?: string;
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Payment {
  id: string;
  visitId: string;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  paymentMethod: number;
  paymentMethodLabel?: string;
  receiptNumber: string;
  notes?: string;
  paidAt: string;
}

export const PaymentMethodLabels: Record<number, string> = {
  0: 'Cash',
  1: 'Credit Card',
  2: 'Bank Transfer',
  3: 'Insurance'
};
