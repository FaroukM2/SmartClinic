import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient, CreatePatientRequest, MedicalHistory } from '../models/patient.models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = `${environment.apiUrl}/Patients`;

  constructor(private http: HttpClient) {}

  createPatient(req: CreatePatientRequest): Observable<string> {
    return this.http.post<string>(this.base, req);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.base}/${id}`);
  }

  searchPatients(clinicId: string, searchTerm?: string): Observable<Patient[]> {
    let url = `${this.base}/search?clinicId=${clinicId}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.http.get<Patient[]>(url);
  }

  addOrUpdateMedicalHistory(req: MedicalHistory): Observable<void> {
    return this.http.post<void>(`${this.base}/medical-history`, req);
  }
}
