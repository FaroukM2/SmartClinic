import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Doctor, Branch } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Doctors & Medical Staff</h1>
        <p>Manage medical specialists and their assigned branch schedules</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/doctors/new" class="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Doctor
        </a>
      </div>
    </div>

    <!-- Branch Selector Tabs -->
    <div class="card mb-6">
      <div class="card__body" style="padding:16px 24px">
        <div class="d-flex align-center gap-2" style="overflow-x:auto">
          <span class="text-muted fs-sm fw-600" style="margin-right:8px">Select Branch:</span>
          @for (b of branches(); track b.id) {
            <button
              class="btn btn-sm"
              [class.btn-primary]="selectedBranchId() === b.id"
              [class.btn-secondary]="selectedBranchId() !== b.id"
              (click)="onSelectBranch(b.id)">
              📍 {{ b.name }}
            </button>
          }
        </div>
      </div>
    </div>

    <!-- Doctors Cards Grid -->
    @if (loading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Loading doctors...</span>
      </div>
    } @else if (doctors().length === 0) {
      <div class="card">
        <div class="card__body">
          <div class="empty-state">
            <div class="empty-icon">🩺</div>
            <h3>No Doctors Assigned</h3>
            <p>No medical staff currently assigned to this branch.</p>
            <a routerLink="/doctors/new" class="btn btn-primary btn-sm">Add Doctor Now</a>
          </div>
        </div>
      </div>
    } @else {
      <div class="stats-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
        @for (doc of doctors(); track doc.id) {
          <div class="card doc-card">
            <div class="card__body">
              <div class="d-flex align-center gap-3 mb-4">
                <div class="avatar avatar-lg" style="background:rgba(13,148,136,0.15);color:var(--primary-light)">
                  👨‍⚕️
                </div>
                <div>
                  <h3 style="font-size:1.05rem;margin:0">{{ doc.fullName }}</h3>
                  <span class="badge badge-primary" style="margin-top:4px">{{ doc.specializationName || 'Specialist' }}</span>
                </div>
              </div>

              <div class="doc-info-list">
                <div class="doc-info-item">
                  <span class="text-muted fs-xs">Title</span>
                  <span class="fs-sm fw-600">{{ doc.title || 'Consultant' }}</span>
                </div>
                <div class="doc-info-item">
                  <span class="text-muted fs-xs">Phone</span>
                  <span class="fs-sm">{{ doc.phoneNumber }}</span>
                </div>
                <div class="doc-info-item">
                  <span class="text-muted fs-xs">License No.</span>
                  <span class="fs-sm">{{ doc.licenseNumber || 'DOC-2026-MED' }}</span>
                </div>
              </div>
            </div>
            <div class="card__footer d-flex justify-between align-center" style="background:var(--surface-2)">
              <span class="text-muted fs-xs">Working Schedule</span>
              <button class="btn btn-secondary btn-sm" (click)="openScheduleModal(doc)">
                📅 Manage Schedule
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Doctor Schedule Modal -->
    @if (selectedDoctorForSchedule) {
      <div class="modal-overlay" (click)="selectedDoctorForSchedule = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h2>📅 Work Schedule — {{ selectedDoctorForSchedule.fullName }}</h2>
            <button class="btn btn-ghost btn-sm" (click)="selectedDoctorForSchedule = null">✕</button>
          </div>
          <div class="modal__body">
            @if (scheduleSuccess()) {
              <div class="alert alert-success mb-4">Work schedule saved successfully!</div>
            }

            <div class="form-group mb-4">
              <label>Day of Week</label>
              <select class="form-control" [(ngModel)]="scheduleForm.dayOfWeek">
                <option [value]="0">Sunday</option>
                <option [value]="1">Monday</option>
                <option [value]="2">Tuesday</option>
                <option [value]="3">Wednesday</option>
                <option [value]="4">Thursday</option>
                <option [value]="5">Friday</option>
                <option [value]="6">Saturday</option>
              </select>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" class="mb-4">
              <div class="form-group">
                <label>Start Time</label>
                <input type="time" class="form-control" [(ngModel)]="scheduleForm.startTime" />
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input type="time" class="form-control" [(ngModel)]="scheduleForm.endTime" />
              </div>
            </div>

            <div class="form-group">
              <label>Max Appointments per Day</label>
              <input type="number" class="form-control" [(ngModel)]="scheduleForm.maxAppointments" />
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn btn-secondary" (click)="selectedDoctorForSchedule = null">Close</button>
            <button class="btn btn-primary" (click)="saveSchedule()">Save Schedule</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .doc-info-list { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--border); padding-top: 14px; }
    .doc-info-item { display: flex; justify-content: space-between; align-items: center; }
  `]
})
export class DoctorsListComponent implements OnInit {
  branches = signal<Branch[]>([]);
  doctors  = signal<Doctor[]>([]);
  selectedBranchId = signal<string>('');
  loading  = signal(true);
  scheduleSuccess = signal(false);

  selectedDoctorForSchedule: Doctor | null = null;
  scheduleForm = {
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '17:00',
    maxAppointments: 20
  };

  constructor(
    private doctorService: DoctorService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const clinicId = this.auth.clinicId();
    if (!clinicId) { this.loading.set(false); return; }

    this.doctorService.getBranchesByClinic(clinicId).subscribe({
      next: (bList) => {
        this.branches.set(bList);
        if (bList.length > 0) {
          this.selectedBranchId.set(bList[0].id);
          this.loadDoctors(bList[0].id);
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  onSelectBranch(bId: string): void {
    this.selectedBranchId.set(bId);
    this.loadDoctors(bId);
  }

  loadDoctors(branchId: string): void {
    this.loading.set(true);
    this.doctorService.getDoctorsByBranch(branchId).subscribe({
      next: (docs) => { this.doctors.set(docs); this.loading.set(false); },
      error: () => { this.doctors.set([]); this.loading.set(false); }
    });
  }

  openScheduleModal(doc: Doctor): void {
    this.selectedDoctorForSchedule = doc;
    this.scheduleSuccess.set(false);
  }

  saveSchedule(): void {
    if (!this.selectedDoctorForSchedule) return;

    this.doctorService.setDoctorSchedule({
      doctorId: this.selectedDoctorForSchedule.id,
      branchId: this.selectedBranchId(),
      dayOfWeek: Number(this.scheduleForm.dayOfWeek),
      startTime: this.scheduleForm.startTime,
      endTime: this.scheduleForm.endTime,
      maxAppointments: Number(this.scheduleForm.maxAppointments)
    }).subscribe({
      next: () => {
        this.scheduleSuccess.set(true);
        setTimeout(() => this.selectedDoctorForSchedule = null, 1200);
      }
    });
  }
}
