import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient, MedicalHistory, GenderLabels, BloodTypeLabels } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (loading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Loading patient record...</span>
      </div>
    } @else if (patient()) {
      <div class="page-header">
        <div class="page-header__left">
          <div class="d-flex align-center gap-3">
            <div class="avatar avatar-lg">{{ patient()!.fullName[0].toUpperCase() }}</div>
            <div>
              <div class="d-flex align-center gap-2">
                <h1>{{ patient()!.fullName }}</h1>
                <span class="badge badge-primary">{{ patient()!.medicalCode }}</span>
              </div>
              <p>Registered Patient File</p>
            </div>
          </div>
        </div>
        <div class="page-header__actions">
          <a routerLink="/appointments/new" [queryParams]="{patientId: patient()!.id}" class="btn btn-primary">
            Book Appointment
          </a>
          <a routerLink="/patients" class="btn btn-secondary">Back to Directory</a>
        </div>
      </div>

      <div class="content-grid" style="grid-template-columns: 320px 1fr">
        <!-- Patient Info Sidebar Card -->
        <div class="card">
          <div class="card__header">
            <h3>Patient Demographics</h3>
          </div>
          <div class="card__body">
            <div class="info-list">
              <div class="info-item">
                <span class="text-muted fs-xs">Primary Phone</span>
                <span class="fw-600 fs-sm">{{ patient()!.primaryPhone }}</span>
              </div>
              <div class="info-item">
                <span class="text-muted fs-xs">Secondary Phone</span>
                <span class="fs-sm">{{ patient()!.secondaryPhone || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="text-muted fs-xs">Gender</span>
                <span class="fs-sm">{{ getGender(patient()!.gender) }}</span>
              </div>
              <div class="info-item">
                <span class="text-muted fs-xs">Date of Birth</span>
                <span class="fs-sm">{{ patient()!.dateOfBirth | date:'longDate' }}</span>
              </div>
              <div class="info-item">
                <span class="text-muted fs-xs">Blood Type</span>
                <span class="badge badge-danger">{{ getBloodType(patient()!.bloodType) }}</span>
              </div>
              <div class="info-item">
                <span class="text-muted fs-xs">Address</span>
                <span class="fs-sm">{{ patient()!.address || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical History & EMR -->
        <div class="card">
          <div class="card__header">
            <h3>Electronic Medical History (EMR)</h3>
            <button class="btn btn-secondary btn-sm" (click)="toggleEditHistory()">
              {{ editingHistory ? 'Cancel' : 'Edit EMR' }}
            </button>
          </div>
          <div class="card__body">
            @if (editingHistory) {
              <form (ngSubmit)="saveMedicalHistory()">
                <div style="display:flex;flex-direction:column;gap:14px">
                  <div class="form-group">
                    <label>Known Allergies</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="historyForm.allergies" name="allergies" placeholder="e.g. Penicillin, Pollen"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Chronic Diseases</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="historyForm.chronicDiseases" name="chronicDiseases" placeholder="e.g. Diabetes Type 2, Hypertension"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Previous Surgeries</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="historyForm.previousSurgeries" name="previousSurgeries" placeholder="e.g. Appendectomy 2020"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Current Medications</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="historyForm.currentMedications" name="currentMedications" placeholder="e.g. Metformin 500mg"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Notes</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="historyForm.notes" name="notes"></textarea>
                  </div>

                  <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px">
                    <button type="submit" class="btn btn-primary btn-sm">Save EMR Changes</button>
                  </div>
                </div>
              </form>
            } @else {
              <div class="emr-grid">
                <div class="emr-box">
                  <span class="emr-label">⚠️ Allergies</span>
                  <p class="emr-content">{{ historyForm.allergies || 'No allergies recorded' }}</p>
                </div>
                <div class="emr-box">
                  <span class="emr-label">🩺 Chronic Diseases</span>
                  <p class="emr-content">{{ historyForm.chronicDiseases || 'No chronic diseases recorded' }}</p>
                </div>
                <div class="emr-box">
                  <span class="emr-label">🏥 Previous Surgeries</span>
                  <p class="emr-content">{{ historyForm.previousSurgeries || 'No previous surgeries recorded' }}</p>
                </div>
                <div class="emr-box">
                  <span class="emr-label">💊 Current Medications</span>
                  <p class="emr-content">{{ historyForm.currentMedications || 'No current medications' }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .info-list { display: flex; flex-direction: column; gap: 14px; }
    .info-item { display: flex; flex-direction: column; gap: 2px; }
    .emr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .emr-box {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
    }
    .emr-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 6px; }
    .emr-content { font-size: 0.875rem; color: var(--text-primary); margin: 0; }
  `]
})
export class PatientDetailComponent implements OnInit {
  @Input() id!: string;
  patient = signal<Patient | null>(null);
  loading = signal(true);
  editingHistory = false;

  historyForm: MedicalHistory = {
    patientId: '',
    allergies: '',
    chronicDiseases: '',
    previousSurgeries: '',
    currentMedications: '',
    notes: ''
  };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    if (this.id) {
      this.historyForm.patientId = this.id;
      this.patientService.getPatientById(this.id).subscribe({
        next: (p) => {
          this.patient.set(p);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  toggleEditHistory(): void {
    this.editingHistory = !this.editingHistory;
  }

  saveMedicalHistory(): void {
    this.patientService.addOrUpdateMedicalHistory(this.historyForm).subscribe({
      next: () => {
        this.editingHistory = false;
      }
    });
  }

  getGender(val: number): string { return GenderLabels[val] ?? 'Other'; }
  getBloodType(val?: number): string { return val !== undefined && val !== null ? BloodTypeLabels[val] : 'N/A'; }
}
