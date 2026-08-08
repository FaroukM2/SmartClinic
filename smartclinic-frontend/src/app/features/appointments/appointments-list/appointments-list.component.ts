import { Component, OnInit, signal } from '@angular/core';
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
        <p>View daily appointment queues and start consultation visits</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/appointments/new" class="btn btn-primary">
          + Book New Appointment
        </a>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="card mb-6">
      <div class="card__body" style="padding:16px 24px">
        <div class="d-flex align-center gap-4" style="flex-wrap:wrap">
          <div class="form-group" style="margin:0;min-width:200px">
            <label class="fs-xs">Branch</label>
            <select class="form-control" [(ngModel)]="selectedBranchId" (ngModelChange)="onBranchChange()">
              @for (b of branches(); track b.id) {
                <option [value]="b.id">{{ b.name }}</option>
              }
            </select>
          </div>

          <div class="form-group" style="margin:0;min-width:220px">
            <label class="fs-xs">Doctor</label>
            <select class="form-control" [(ngModel)]="selectedDoctorId" (ngModelChange)="loadAppointments()">
              <option value="">All Doctors in Branch</option>
              @for (d of doctors(); track d.id) {
                <option [value]="d.id">{{ d.fullName }}</option>
              }
            </select>
          </div>

          <div class="form-group" style="margin:0;min-width:160px">
            <label class="fs-xs">Date</label>
            <input type="date" class="form-control" [(ngModel)]="selectedDate" (ngModelChange)="loadAppointments()" />
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
            <span>Loading daily schedule...</span>
          </div>
        } @else if (appointments().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No Appointments Today</h3>
            <p>No appointments booked for the selected date and doctor.</p>
            <a routerLink="/appointments/new" class="btn btn-primary btn-sm">Book Appointment</a>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:80px">Queue #</th>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Date & Time</th>
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
                      <div class="fw-600">{{ app.patientName || 'Registered Patient' }}</div>
                      <span class="text-muted fs-xs">{{ app.patientMedicalCode || 'P-2026-MED' }}</span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + getBadge(app.appointmentStatus)">
                        <span class="dot"></span>
                        {{ getStatusLabel(app.appointmentStatus) }}
                      </span>
                    </td>
                    <td class="fs-sm">
                      {{ app.appointmentDate }} {{ app.startTime || '09:00 AM' }}
                    </td>
                    <td class="text-muted fs-xs">{{ app.notes || '—' }}</td>
                    <td style="text-align:right">
                      @if (app.appointmentStatus === 0 || app.appointmentStatus === 1) {
                        <button class="btn btn-primary btn-sm" (click)="startVisit(app.id)">
                          🚀 Start Visit
                        </button>
                      } @else if (app.appointmentStatus === 2) {
                        <span class="badge badge-warning">In Consultation</span>
                      } @else {
                        <span class="badge badge-success">Completed</span>
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
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary-light);
    }
  `]
})
export class AppointmentsListComponent implements OnInit {
  branches = signal<Branch[]>([]);
  doctors  = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  loading  = signal(true);

  selectedBranchId = '';
  selectedDoctorId = '';
  selectedDate     = new Date().toISOString().split('T')[0];

  constructor(
    private clinicService: ClinicService,
    private doctorService: DoctorService,
    private auth: AuthService,
    private router: Router
  ) {}

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
        this.doctors.set(docs);
        this.loadAppointments();
      }
    });
  }

  loadAppointments(): void {
    this.loading.set(true);
    // Demo appointments list fallback if API endpoint is doctorBranch specific
    const doctorBranchId = this.selectedDoctorId || '00000000-0000-0000-0000-000000000000';
    this.clinicService.getAppointmentsByDoctorBranch(doctorBranchId, this.selectedDate).subscribe({
      next: (res) => { this.appointments.set(res); this.loading.set(false); },
      error: () => { this.appointments.set([]); this.loading.set(false); }
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
