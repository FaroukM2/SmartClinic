import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient, GenderLabels, BloodTypeLabels } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Patients Directory</h1>
        <p>Manage and search all registered clinic patients</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/patients/new" class="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register Patient
        </a>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card mb-6">
      <div class="card__body" style="padding:16px 24px">
        <div class="d-flex align-center justify-between gap-3" style="flex-wrap:wrap">
          <div class="search-bar">
            <span class="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Search by name, phone or code..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()"
            />
          </div>
          <span class="text-muted fs-sm">Total Patients: {{ patients().length }}</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card__body" style="padding:0">
        @if (loading()) {
          <div class="loading-container">
            <div class="spinner"></div>
            <span>Loading patients list...</span>
          </div>
        } @else if (patients().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No Patients Found</h3>
            <p>No registered patients matched your search criteria.</p>
            <a routerLink="/patients/new" class="btn btn-primary btn-sm">Register First Patient</a>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Medical Code</th>
                  <th>Patient Name</th>
                  <th>Primary Phone</th>
                  <th>Gender</th>
                  <th>Blood Type</th>
                  <th>Registered On</th>
                  <th style="text-align:right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (p of patients(); track p.id) {
                  <tr>
                    <td>
                      <span class="badge badge-primary">{{ p.medicalCode }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-center gap-2">
                        <div class="avatar avatar-sm">{{ p.fullName[0].toUpperCase() }}</div>
                        <span class="fw-600">{{ p.fullName }}</span>
                      </div>
                    </td>
                    <td>{{ p.primaryPhone }}</td>
                    <td>{{ getGenderLabel(p.gender) }}</td>
                    <td>
                      @if (p.bloodType !== undefined && p.bloodType !== null) {
                        <span class="badge badge-danger">{{ getBloodTypeLabel(p.bloodType) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td class="text-muted fs-xs">{{ p.createdOn | date:'mediumDate' }}</td>
                    <td style="text-align:right">
                      <a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm">
                        View EMR
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class PatientsListComponent implements OnInit {
  patients = signal<Patient[]>([]);
  loading  = signal(true);
  searchTerm = '';

  constructor(
    private patientService: PatientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    const clinicId = this.auth.clinicId();
    if (!clinicId) { this.loading.set(false); return; }

    this.patientService.searchPatients(clinicId, this.searchTerm).subscribe({
      next: (data) => { this.patients.set(data); this.loading.set(false); },
      error: () => { this.patients.set([]); this.loading.set(false); }
    });
  }

  onSearch(): void {
    this.loadPatients();
  }

  getGenderLabel(val: number): string {
    return GenderLabels[val] ?? 'Other';
  }

  getBloodTypeLabel(val: number): string {
    return BloodTypeLabels[val] ?? 'Unknown';
  }
}
