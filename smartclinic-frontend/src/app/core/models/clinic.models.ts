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
  amount: number;
  totalAmount?: number;
  discount: number;
  discountAmount?: number;
  netAmount: number;
  paymentMethod: number;
  paymentMethodLabel?: string;
  receiptNumber?: string;
  createdByUserId?: string;
  createdByUserName?: string;
  patientName?: string;
  notes?: string;
  createdAt?: string;
  paidAt?: string;
}

export const PaymentMethodLabels: Record<number, string> = {
  1: 'Cash',
  2: 'Credit Card',
  3: 'Insurance'
};
