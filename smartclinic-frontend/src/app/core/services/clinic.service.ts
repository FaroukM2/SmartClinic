import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Appointment, BookAppointmentRequest, ChangeAppointmentStatusRequest
} from '../models/appointment.models';
import {
  Visit, Prescription, Payment, DashboardStats
} from '../models/clinic.models';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  constructor(private http: HttpClient) {}

  // ── Dashboard ──────────────────────────────────────────────────
  getDashboardStats(clinicId: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/Dashboard/stats/${clinicId}`);
  }

  // ── Appointments ───────────────────────────────────────────────
  bookAppointment(req: BookAppointmentRequest): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/Appointments/book`, req);
  }

  changeAppointmentStatus(req: ChangeAppointmentStatusRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Appointments/status`, req);
  }

  getAppointmentsByDoctorBranch(doctorBranchId: string, date?: string): Observable<Appointment[]> {
    let url = `${environment.apiUrl}/Appointments/doctor-branch/${doctorBranchId}`;
    if (date) url += `?date=${date}`;
    return this.http.get<Appointment[]>(url);
  }

  // ── Visits ─────────────────────────────────────────────────────
  startVisit(appointmentId: string): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/Visits/start`, { appointmentId });
  }

  updateVisit(req: any): Observable<void> {
    const payload = {
      visitId: req.visitId || req.id,
      chiefComplaint: req.chiefComplaint,
      physicalExamination: req.physicalExamination || '',
      diagnosis: req.diagnosis,
      doctorNotes: req.doctorNotes || req.treatment || '',
      isCompleted: req.isCompleted || false
    };
    return this.http.put<void>(`${environment.apiUrl}/Visits/update`, payload);
  }

  getVisitById(id: string): Observable<Visit> {
    return this.http.get<Visit>(`${environment.apiUrl}/Visits/${id}`);
  }

  // ── Prescriptions ──────────────────────────────────────────────
  createPrescription(req: Prescription): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/Prescriptions`, req);
  }

  getPrescriptionByVisitId(visitId: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${environment.apiUrl}/Prescriptions/visit/${visitId}`);
  }

  // ── Payments ───────────────────────────────────────────────────
  processPayment(req: any): Observable<string> {
    const payload = {
      visitId: req.visitId,
      amount: req.amount ?? req.totalAmount ?? 0,
      discount: req.discount ?? req.discountAmount ?? 0,
      paymentMethod: Number(req.paymentMethod ?? 1),
      createdByUserId: req.createdByUserId || '00000000-0000-0000-0000-000000000000'
    };
    return this.http.post<string>(`${environment.apiUrl}/Payments/process`, payload);
  }

  getPaymentByVisitId(visitId: string): Observable<Payment> {
    return this.http.get<Payment>(`${environment.apiUrl}/Payments/visit/${visitId}`);
  }
}
