import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment, AppointmentStatusLabels, AppointmentStatusBadge } from '../../../core/models/appointment.models';
import { Branch, Doctor } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Appointment Schedule & Queue</h1>
        <p>Manage daily patient bookings, waiting queue, and consultation visits</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/appointments/new" class="btn btn-primary">
          + Book New Appointment
        </a>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="stats-row mb-6">
      <div class="stat-card">
        <div class="stat-number">{{ totalCount() }}</div>
        <div class="stat-label">Total Booked</div>
      </div>
      <div class="stat-card stat-waiting">
        <div class="stat-number">{{ waitingCount() }}</div>
        <div class="stat-label">Waiting in Queue</div>
      </div>
      <div class="stat-card stat-consulting">
        <div class="stat-number">{{ consultingCount() }}</div>
        <div class="stat-label">In Consultation</div>
      </div>
      <div class="stat-card stat-completed">
        <div class="stat-number">{{ completedCount() }}</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="card mb-6">
      <div class="card__body" style="padding:16px 24px">
        <div class="d-flex align-center gap-4" style="flex-wrap:wrap">
          <div class="form-group" style="margin:0;min-width:200px">
            <label class="fs-xs fw-600 text-muted">Branch</label>
            <select class="form-control" [(ngModel)]="selectedBranchId" (ngModelChange)="onBranchChange()">
              @for (b of branches(); track b.id) {
                <option [value]="b.id">{{ b.name }}</option>
              }
            </select>
          </div>

          <div class="form-group" style="margin:0;min-width:220px">
            <label class="fs-xs fw-600 text-muted">Doctor</label>
            <select class="form-control" [(ngModel)]="selectedDoctorId" (ngModelChange)="loadAppointments()">
              <option value="">All Doctors in Branch</option>
              @for (d of doctors(); track d.id) {
                <option [value]="d.id">{{ d.fullName }} ({{ d.specializationName || 'Specialist' }})</option>
              }
            </select>
          </div>

          <div class="form-group" style="margin:0;min-width:170px">
            <label class="fs-xs fw-600 text-muted">Schedule Date</label>
            <input type="date" class="form-control" [(ngModel)]="selectedDate" (ngModelChange)="loadAppointments()" />
          </div>

          <div style="margin-top:auto;padding-bottom:2px">
            <button class="btn btn-secondary btn-sm" (click)="loadAppointments()" title="Refresh Schedule">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointments Table -->
    <div class="card">
      <div class="card__body" style="padding:0">
        @if (loading()) {
          <div class="loading-container">
            <div class="spinner"></div>
            <span>Loading appointments schedule...</span>
          </div>
        } @else if (appointments().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No Appointments Found</h3>
            <p>No appointments booked for the selected date and doctor filter.</p>
            <a routerLink="/appointments/new" class="btn btn-primary btn-sm">Book Appointment</a>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:70px">Queue</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time & Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th style="text-align:right">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (app of appointments(); track app.id) {
                  <tr>
                    <td>
                      <span class="queue-num">#{{ app.queueNumber || 1 }}</span>
                    </td>
                    <td>
                      <div class="fw-600 text-primary-dark">{{ app.patientName || 'Patient' }}</div>
                      <span class="text-muted fs-xs">
                        {{ app.patientPhone || app.patientMedicalCode || 'Registered' }}
                      </span>
                    </td>
                    <td>
                      <div class="fw-600">{{ app.doctorName || 'Assigned Doctor' }}</div>
                      <span class="text-muted fs-xs">{{ app.specializationName || 'Specialist' }}</span>
                    </td>
                    <td class="fs-sm">
                      <div class="fw-600">{{ app.startTime || 'Scheduled' }}</div>
                      <span class="text-muted fs-xs">{{ app.appointmentDate }}</span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + getBadge(app.appointmentStatus)">
                        <span class="dot"></span>
                        {{ getStatusLabel(app.appointmentStatus) }}
                      </span>
                    </td>
                    <td class="text-muted fs-xs" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                      {{ app.notes || '—' }}
                    </td>
                    <td style="text-align:right">
                      @if (isReceptionist()) {
                        @if (app.appointmentStatus === 1) {
                          <button class="btn btn-primary btn-sm" (click)="checkIn(app)" title="Check-in patient into waiting room">
                            📥 Check-In
                          </button>
                        } @else if (app.appointmentStatus === 2) {
                          <span class="badge badge-warning">Waiting in Queue</span>
                        } @else if (app.appointmentStatus === 3) {
                          <span class="badge badge-primary">With Doctor</span>
                        } @else if (app.appointmentStatus === 4) {
                          <a routerLink="/payments" class="btn btn-secondary btn-sm">💳 Billing</a>
                        } @else {
                          <span class="text-muted fs-xs">—</span>
                        }
                      } @else {
                        @if (app.appointmentStatus === 1 || app.appointmentStatus === 2) {
                          <button class="btn btn-primary btn-sm" (click)="startVisit(app.id)">
                            🚀 Start Visit
                          </button>
                        } @else if (app.appointmentStatus === 3) {
                          <button class="btn btn-secondary btn-sm" (click)="startVisit(app.id)">
                            🔍 Resume
                          </button>
                        } @else {
                          <span class="badge badge-success">Completed</span>
                        }
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .queue-num {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-light);
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .stat-number {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-heading);
      line-height: 1.2;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 4px;
      font-weight: 500;
    }
    .stat-waiting .stat-number { color: #f59e0b; }
    .stat-consulting .stat-number { color: #3b82f6; }
    .stat-completed .stat-number { color: #10b981; }
  `]
})
export class AppointmentsListComponent implements OnInit {
  private clinicService = inject(ClinicService);
  private doctorService = inject(DoctorService);
  private auth = inject(AuthService);
  private router = inject(Router);

  branches = signal<Branch[]>([]);
  doctors  = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  loading  = signal(true);

  readonly isReceptionist = this.auth.isReceptionist;
  readonly isDoctor = this.auth.isDoctor;

  selectedBranchId = '';
  selectedDoctorId = '';
  selectedDate     = new Date().toISOString().split('T')[0];

  totalCount = computed(() => this.appointments().length);
  waitingCount = computed(() => this.appointments().filter(a => a.appointmentStatus === 2).length);
  consultingCount = computed(() => this.appointments().filter(a => a.appointmentStatus === 3).length);
  completedCount = computed(() => this.appointments().filter(a => a.appointmentStatus === 4).length);

  ngOnInit(): void {
    const cid = this.auth.clinicId();
    if (!cid) { this.loading.set(false); return; }

    this.doctorService.getBranchesByClinic(cid).subscribe({
      next: (bList) => {
        this.branches.set(bList);
        if (bList.length > 0) {
          this.selectedBranchId = bList[0].id;
          this.onBranchChange();
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  onBranchChange(): void {
    if (!this.selectedBranchId) return;
    this.doctorService.getDoctorsByBranch(this.selectedBranchId).subscribe({
      next: (docs) => {
        this.doctors.set(docs || []);
        this.loadAppointments();
      },
      error: () => {
        this.loadAppointments();
      }
    });
  }

  loadAppointments(): void {
    if (!this.selectedBranchId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const doctorFilter = this.selectedDoctorId ? this.selectedDoctorId : undefined;

    this.clinicService.getAppointmentsByBranch(
      this.selectedBranchId,
      this.selectedDate,
      doctorFilter
    ).subscribe({
      next: (res) => {
        this.appointments.set(res || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.appointments.set([]);
        this.loading.set(false);
      }
    });
  }

  checkIn(app: Appointment): void {
    this.clinicService.changeAppointmentStatus({
      appointmentId: app.id,
      newStatus: 2 // Waiting
    }).subscribe({
      next: () => {
        app.appointmentStatus = 2;
      }
    });
  }

  startVisit(appointmentId: string): void {
    this.clinicService.startVisit(appointmentId).subscribe({
      next: (visitId) => {
        this.router.navigate(['/visits', visitId]);
      }
    });
  }

  getStatusLabel(val: number): string { return AppointmentStatusLabels[val] ?? 'Scheduled'; }
  getBadge(val: number): string { return AppointmentStatusBadge[val] ?? 'info'; }
}
