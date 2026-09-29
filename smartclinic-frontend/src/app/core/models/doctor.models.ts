export interface DoctorBranchInfo {
  id?: string;
  branchId: string;
  branchName: string;
  consultationFee?: number;
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  specializationId: string;
  specializationName?: string;
  title?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  doctorBranchId?: string;
  isActive: boolean;
  branches?: DoctorBranchInfo[];
}

export interface DoctorBranch {
  doctorId: string;
  branchId: string;
  consultationFee?: number;
}

export interface DoctorSchedule {
  doctorId: string;
  branchId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxAppointments: number;
}

export interface Specialization {
  id: string;
  name: string;
  clinicId: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  clinicId: string;
  isActive: boolean;
}
