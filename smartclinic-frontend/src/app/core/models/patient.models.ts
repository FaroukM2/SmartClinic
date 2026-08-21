export interface Patient {
  id: string;
  medicalCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  genderLabel?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  address?: string;
  bloodType?: number;
  bloodTypeLabel?: string;
  clinicId: string;
  isActive: boolean;
  createdOn: string;
}

export interface CreatePatientRequest {
  clinicId: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  primaryPhone: string;
  secondaryPhone?: string;
  address?: string;
  bloodType?: number;
}

export interface MedicalHistory {
  patientId: string;
  allergies?: string;
  chronicDiseases?: string;
  previousSurgeries?: string;
  familyHistory?: string;
  currentMedications?: string;
  notes?: string;
}

export const GenderLabels: Record<number, string> = { 1: 'Male', 2: 'Female' };
export const BloodTypeLabels: Record<number, string> = {
  1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-', 5: 'AB+', 6: 'AB-', 7: 'O+', 8: 'O-'
};
