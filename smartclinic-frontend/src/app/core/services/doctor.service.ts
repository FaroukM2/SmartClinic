import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor, DoctorBranch, DoctorSchedule, Specialization, Branch } from '../models/doctor.models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private base     = `${environment.apiUrl}/Doctors`;
  private specBase = `${environment.apiUrl}/Specializations`;
  private branchBase = `${environment.apiUrl}/Branches`;

  constructor(private http: HttpClient) {}

  createDoctor(req: any): Observable<string> {
    return this.http.post<string>(this.base, req);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.base}/${id}`);
  }

  getDoctorsByBranch(branchId: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.base}/branch/${branchId}`);
  }

  assignDoctorToBranch(req: DoctorBranch): Observable<void> {
    return this.http.post<void>(`${this.base}/assign-branch`, req);
  }

  setDoctorSchedule(req: DoctorSchedule): Observable<void> {
    return this.http.post<void>(`${this.base}/schedule`, req);
  }

  // Specializations
  createSpecialization(req: { clinicId: string; name: string }): Observable<string> {
    return this.http.post<string>(this.specBase, req);
  }

  getSpecializationsByClinic(clinicId: string): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.specBase}/clinic/${clinicId}`);
  }

  // Branches
  createBranch(req: any): Observable<string> {
    return this.http.post<string>(this.branchBase, req);
  }

  updateBranch(id: string, req: any): Observable<void> {
    return this.http.put<void>(`${this.branchBase}/${id}`, req);
  }

  getBranchById(id: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.branchBase}/${id}`);
  }

  getBranchesByClinic(clinicId: string): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.branchBase}/clinic/${clinicId}`);
  }
}
