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

  updateVisit(req: Partial<Visit>): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Visits/update`, req);
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
  processPayment(req: Partial<Payment>): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/Payments/process`, req);
  }

  getPaymentByVisitId(visitId: string): Observable<Payment> {
    return this.http.get<Payment>(`${environment.apiUrl}/Payments/visit/${visitId}`);
  }
}
