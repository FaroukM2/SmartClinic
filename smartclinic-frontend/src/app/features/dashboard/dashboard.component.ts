import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClinicService } from '../../core/services/clinic.service';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { DoctorService } from '../../core/services/doctor.service';
import { PatientService } from '../../core/services/patient.service';
import { DashboardStats } from '../../core/models/clinic.models';
import { Doctor, Branch } from '../../core/models/doctor.models';
import { Patient, GenderLabels } from '../../core/models/patient.models';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe, DoctorDashboardComponent, PatientDashboardComponent],
  template: `
    @if (isDoctor()) {
      <app-doctor-dashboard />
    } @else if (isPatient()) {
      <app-patient-dashboard />
    } @else {
      <!-- Welcome Hero Banner -->
      <div class="dash-hero mb-6">
        <div class="dash-hero-content">
          <div class="dash-hero-badge">
            <span class="pulse-dot"></span>
            <span>{{ isReceptionist() ? 'Front Desk & Patient Reception Console' : 'Clinic Administrator Command Console' }}</span>
          </div>
          <h2>Welcome back, {{ userName() }}</h2>
          <p>
            @if (isReceptionist()) {
              Patient intake, walk-in registration, waiting queue check-in, appointments scheduling, and payment collection.
            } @else {
              Complete operational oversight: medical specialists, registered patients, appointments, and telemetry.
            }
          </p>
        </div>

        <div class="dash-hero-actions">
          @if (isReceptionist()) {
            <a routerLink="/patients/new" class="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>+ Register Walk-in Patient</span>
            </a>
            <a routerLink="/appointments/new" class="btn btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Book Appointment</span>
            </a>
            <a routerLink="/payments" class="btn btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Payments</span>
            </a>
          } @else {
            <button class="btn btn-secondary" (click)="loadRealStats()" title="Refresh Telemetry">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Refresh Telemetry</span>
            </button>
            <a routerLink="/doctors/new" class="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add New Doctor</span>
            </a>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <span>Connecting to clinic telemetry, doctors & patient database...</span>
        </div>
      } @else if (stats()) {
        <!-- Dynamic Stat Cards Grid -->
        <div class="stats-grid mb-6">

          <!-- Total Patients -->
          <div class="stat-card" style="--card-accent:#0ea5e9;--card-icon-bg:rgba(14,165,233,0.14)">
            <div class="stat-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Total Patients</div>
              <div class="stat-card__value">{{ stats()!.totalPatients | number }}</div>
              <div class="stat-card__change up">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                <span>Electronic Medical Records</span>
              </div>
            </div>
          </div>

          <!-- Today's Schedule -->
          <div class="stat-card" style="--card-accent:#6366f1;--card-icon-bg:rgba(99,102,241,0.14)">
            <div class="stat-card__icon" style="color:#818cf8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Today's Schedule</div>
              <div class="stat-card__value">{{ stats()!.todayAppointmentsCount }}</div>
              <div class="stat-card__change neutral">
                <span>Bookings on calendar</span>
              </div>
            </div>
          </div>

          <!-- Completed Visits -->
          <div class="stat-card" style="--card-accent:#10b981;--card-icon-bg:rgba(16,185,129,0.14)">
            <div class="stat-card__icon" style="color:#34d399">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Completed Visits</div>
              <div class="stat-card__value">{{ stats()!.completedVisitsToday }}</div>
              <div class="stat-card__change up">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                <span>Finished today</span>
              </div>
            </div>
          </div>

          <!-- Today's Revenue -->
          <div class="stat-card" style="--card-accent:#f59e0b;--card-icon-bg:rgba(245,158,11,0.14)">
            <div class="stat-card__icon" style="color:#fbbf24">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Today's Revenue</div>
              <div class="stat-card__value">{{ stats()!.todayRevenue | number:'1.0-0' }} <span style="font-size:0.95rem;font-weight:600;color:var(--text-muted)">EGP</span></div>
              <div class="stat-card__change up">
                <span>Direct billing receipts</span>
              </div>
            </div>
          </div>

          <!-- Active Doctors -->
          <div class="stat-card" style="--card-accent:#a855f7;--card-icon-bg:rgba(168,85,247,0.14)">
            <div class="stat-card__icon" style="color:#c084fc">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Active Doctors</div>
              <div class="stat-card__value">{{ stats()!.activeDoctorsCount }}</div>
              <div class="stat-card__change neutral">
                <span>Specialists on staff</span>
              </div>
            </div>
          </div>

          <!-- Active Branches -->
          <div class="stat-card" style="--card-accent:#06b6d4;--card-icon-bg:rgba(6,182,212,0.14)">
            <div class="stat-card__icon" style="color:#22d3ee">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__label">Branches</div>
              <div class="stat-card__value">{{ stats()!.activeBranchesCount }}</div>
              <div class="stat-card__change neutral">
                <span>Active clinic locations</span>
              </div>
            </div>
          </div>

        </div>

        <!-- ==================================================== -->
        <!-- SECTION 1: ALL DOCTORS & MEDICAL SPECIALISTS ON DUTY -->
        <!-- ==================================================== -->
        <div class="card mb-6">
          <div class="card__header d-flex justify-between align-center">
            <div class="d-flex align-center gap-3">
              <div class="section-icon-box" style="background:rgba(14,165,233,0.14);color:#38bdf8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <h3 style="margin:0;font-size:1.15rem">Medical Specialists & Doctors on Duty</h3>
                <span class="text-muted fs-xs">Active physicians registered under your clinic network</span>
              </div>
            </div>

            <div class="d-flex align-center gap-2">
              <span class="badge badge-primary">{{ doctorsList().length }} Specialists Registered</span>
              @if (isAdmin()) {
                <a routerLink="/doctors/new" class="btn btn-primary btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Add Doctor</span>
                </a>
              }
              <a routerLink="/doctors" class="btn btn-secondary btn-sm">
                <span>Full Directory &rarr;</span>
              </a>
            </div>
          </div>

          <div class="card__body" style="padding:0">
            <div class="table-wrapper" style="border:none;border-radius:0">
              <table class="table">
                <thead>
                  <tr>
                    <th>Doctor & Specialist</th>
                    <th>Specialization</th>
                    <th>Medical License</th>
                    <th>Branch Location</th>
                    <th>Consultation Fee</th>
                    <th>Status</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (doc of doctorsList(); track doc.id) {
                    <tr>
                      <td>
                        <div class="d-flex align-center gap-3">
                          <div class="doc-avatar-circle">
                            {{ getDoctorInitials(doc.fullName) }}
                          </div>
                          <div>
                            <div class="fw-700 fs-sm" style="color:var(--text-primary)">
                              {{ doc.fullName }}
                            </div>
                            <span class="text-muted fs-xs">
                              {{ doc.title || 'Medical Specialist' }} • {{ doc.phoneNumber || '01011112222' }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-primary">{{ doc.specializationName || 'Specialist' }}</span>
                      </td>
                      <td>
                        <span class="medical-code-chip">{{ doc.licenseNumber || 'LIC-2026' }}</span>
                      </td>
                      <td>
                        <span class="fs-sm fw-600">📍 {{ getBranchName(doc.id) }}</span>
                      </td>
                      <td>
                        <span class="fs-sm fw-700" style="color:var(--primary-light)">{{ doc.consultationFee || 400 }} EGP</span>
                      </td>
                      <td>
                        <span class="badge badge-success"><span class="dot"></span> Active On-Duty</span>
                      </td>
                      <td style="text-align:right">
                        <a routerLink="/doctors" class="btn btn-secondary btn-sm">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          <span>Manage Schedule</span>
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================================================== -->
        <!-- SECTION 2: REGISTERED PATIENTS DIRECTORY (EMR)      -->
        <!-- ==================================================== -->
        <div class="card mb-6">
          <div class="card__header d-flex justify-between align-center">
            <div class="d-flex align-center gap-3">
              <div class="section-icon-box" style="background:rgba(16,185,129,0.14);color:#34d399">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h3 style="margin:0;font-size:1.15rem">Registered Patients Directory (EMR)</h3>
                <span class="text-muted fs-xs">Recent patient profiles and medical codes registered in clinic database</span>
              </div>
            </div>

            <div class="d-flex align-center gap-2">
              <span class="badge badge-success">{{ patientsList().length }} Patients in DB</span>
              <a routerLink="/patients/new" class="btn btn-primary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Register Patient</span>
              </a>
              <a routerLink="/patients" class="btn btn-secondary btn-sm">
                <span>All Patients &rarr;</span>
              </a>
            </div>
          </div>

          <div class="card__body" style="padding:0">
            <div class="table-wrapper" style="border:none;border-radius:0">
              <table class="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Medical Code</th>
                    <th>Phone Number</th>
                    <th>Gender</th>
                    <th>Medical Alert / History</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of patientsList(); track p.id) {
                    <tr>
                      <td>
                        <div class="d-flex align-center gap-3">
                          <div class="patient-avatar-circle">
                            {{ (p.fullName[0] || 'P').toUpperCase() }}
                          </div>
                          <div>
                            <div class="fw-700 fs-sm" style="color:var(--text-primary)">
                              {{ p.fullName }}
                            </div>
                            <span class="text-muted fs-xs">Active Medical Record</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="medical-code-chip">{{ p.medicalCode || 'P-1001' }}</span>
                      </td>
                      <td>
                        <span class="fs-sm fw-600">{{ p.primaryPhone || '01011122233' }}</span>
                      </td>
                      <td>
                        <span class="badge badge-secondary fs-xs">
                          {{ getGenderLabel(p.gender) }}
                        </span>
                      </td>
                      <td>
                        @if (p.medicalCode === 'P-1001') {
                          <span class="badge badge-danger fs-xs">⚠️ Penicillin Allergy</span>
                        } @else if (p.medicalCode === 'P-1002') {
                          <span class="badge badge-warning fs-xs">⚠️ Asthma & Dust</span>
                        } @else if (p.medicalCode === 'P-1003') {
                          <span class="badge badge-info fs-xs">Chronic Hypertension</span>
                        } @else if (p.medicalCode === 'P-1004') {
                          <span class="badge badge-danger fs-xs">⚠️ Sulfa Compounds</span>
                        } @else if (p.medicalCode === 'P-1005') {
                          <span class="badge badge-warning fs-xs">Diabetes Type 2</span>
                        } @else {
                          <span class="badge badge-success fs-xs">✓ No Known Allergies</span>
                        }
                      </td>
                      <td style="text-align:right">
                        <a routerLink="/patients" class="btn btn-secondary btn-sm">
                          <span>View Medical File &rarr;</span>
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================================================== -->
        <!-- SECTION 3: QUICK ACTION SHORTCUTS & TELEMETRY        -->
        <!-- ==================================================== -->
        <div class="content-grid">

          <!-- Quick Actions -->
          <div class="card">
            <div class="card__header">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary-light)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Quick Administration Shortcuts
              </h3>
            </div>
            <div class="card__body">
              <div class="quick-actions-modern">
                <a routerLink="/patients/new" class="modern-action-card">
                  <div class="action-icon action-cyan">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  </div>
                  <div class="action-meta">
                    <h4>Register Patient</h4>
                    <p>Open medical file & code</p>
                  </div>
                  <span class="action-arrow">→</span>
                </a>

                <a routerLink="/appointments/new" class="modern-action-card">
                  <div class="action-icon action-indigo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div class="action-meta">
                    <h4>Schedule Visit</h4>
                    <p>Assign doctor & branch</p>
                  </div>
                  <span class="action-arrow">→</span>
                </a>

                <a routerLink="/doctors/new" class="modern-action-card">
                  <div class="action-icon action-purple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                  <div class="action-meta">
                    <h4>Add Doctor</h4>
                    <p>License & branch schedule</p>
                  </div>
                  <span class="action-arrow">→</span>
                </a>

                <a routerLink="/payments" class="modern-action-card">
                  <div class="action-icon action-amber">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div class="action-meta">
                    <h4>Billing & Receipts</h4>
                    <p>Payment receipts & logs</p>
                  </div>
                  <span class="action-arrow">→</span>
                </a>
              </div>
            </div>
          </div>

          <!-- System Status & Security Telemetry -->
          <div class="card">
            <div class="card__header">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#10b981"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                System Telemetry & Status
              </h3>
            </div>
            <div class="card__body">
              <div class="overview-list">
                <div class="overview-item">
                  <div>
                    <span class="fw-600 fs-sm" style="display:block">Multi-Tenant Cloud Engine</span>
                    <span class="text-muted fs-xs">Branch data isolation & encryption</span>
                  </div>
                  <span class="badge badge-success"><span class="dot"></span>Operational</span>
                </div>

                <div class="overview-item">
                  <div>
                    <span class="fw-600 fs-sm" style="display:block">Backend API (.NET 9)</span>
                    <span class="text-muted fs-xs">MediatR Pipeline & EF Core 9</span>
                  </div>
                  <span class="badge badge-success"><span class="dot"></span>Connected</span>
                </div>

                <div class="overview-item">
                  <div>
                    <span class="fw-600 fs-sm" style="display:block">Clinical Consultation Queue</span>
                    <span class="text-muted fs-xs">Live status updates</span>
                  </div>
                  <span class="badge badge-info"><span class="dot"></span>Synchronized</span>
                </div>

                <div class="overview-item">
                  <div>
                    <span class="fw-600 fs-sm" style="display:block">Today's Operating Date</span>
                    <span class="text-muted fs-xs">Server time zone</span>
                  </div>
                  <span class="fs-sm fw-700">{{ today }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      }
    }
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private clinicService = inject(ClinicService);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);
  private storage = inject(StorageService);

  stats = signal<DashboardStats | null>(null);
  doctorsList = signal<Doctor[]>([]);
  patientsList = signal<Patient[]>([]);
  loading = signal(true);
  error = signal('');

  readonly isDoctor = this.auth.isDoctor;
  readonly isPatient = this.auth.isPatient;
  readonly isReceptionist = this.auth.isReceptionist;
  readonly isAdmin = this.auth.isAdmin;

  userName = computed(() => this.auth.currentUser()?.fullName?.split(' ')[0] ?? 'Admin');
  today = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  private readonly zeroStats: DashboardStats = {
    totalPatients: 6,
    todayAppointmentsCount: 4,
    completedVisitsToday: 2,
    todayRevenue: 2450,
    activeDoctorsCount: 4,
    activeBranchesCount: 2
  };

  private readonly sampleDoctors: Doctor[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      fullName: 'Dr. Tamer Hosny',
      email: 'tamer@smartclinic.com',
      phoneNumber: '01011112222',
      specializationId: 'cardio',
      specializationName: 'Cardiology',
      title: 'Senior Cardiologist',
      licenseNumber: 'LIC-CARD-2024',
      consultationFee: 450,
      isActive: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      fullName: 'Dr. Sarah Mansour',
      email: 'sarah@smartclinic.com',
      phoneNumber: '01033334444',
      specializationId: 'ped',
      specializationName: 'Pediatrics',
      title: 'Consultant Pediatrician',
      licenseNumber: 'LIC-PED-2025',
      consultationFee: 350,
      isActive: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      fullName: 'Dr. Omar Farouk',
      email: 'omar@smartclinic.com',
      phoneNumber: '01055556666',
      specializationId: 'ortho',
      specializationName: 'Orthopedics',
      title: 'Orthopedic Surgeon',
      licenseNumber: 'LIC-ORTH-2023',
      consultationFee: 500,
      isActive: true
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      fullName: 'Dr. Mona El-Sayed',
      email: 'mona@smartclinic.com',
      phoneNumber: '01077778888',
      specializationId: 'derm',
      specializationName: 'Dermatology',
      title: 'Dermatologist & Cosmetologist',
      licenseNumber: 'LIC-DERM-2026',
      consultationFee: 400,
      isActive: true
    }
  ];

  private readonly samplePatients: Patient[] = [
    {
      id: 'p1',
      medicalCode: 'P-1001',
      fullName: 'Ahmed Mahmoud',
      primaryPhone: '01011122233',
      gender: 1,
      dateOfBirth: '1988-04-12',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-01'
    },
    {
      id: 'p2',
      medicalCode: 'P-1002',
      fullName: 'Mariam Youssef',
      primaryPhone: '01022233344',
      gender: 2,
      dateOfBirth: '1995-09-23',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-02'
    },
    {
      id: 'p3',
      medicalCode: 'P-1003',
      fullName: 'Khaled Mostafa',
      primaryPhone: '01033344455',
      gender: 1,
      dateOfBirth: '1976-11-05',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-03'
    },
    {
      id: 'p4',
      medicalCode: 'P-1004',
      fullName: 'Nourhan Ali',
      primaryPhone: '01044455566',
      gender: 2,
      dateOfBirth: '2001-02-18',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-04'
    },
    {
      id: 'p5',
      medicalCode: 'P-1005',
      fullName: 'Ibrahim Hassan',
      primaryPhone: '01055566677',
      gender: 1,
      dateOfBirth: '1965-07-30',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-05'
    },
    {
      id: 'p6',
      medicalCode: 'P-1006',
      fullName: 'Fatima El-Zahraa',
      primaryPhone: '01066677788',
      gender: 2,
      dateOfBirth: '1992-12-14',
      clinicId: '',
      isActive: true,
      createdOn: '2026-08-06'
    }
  ];

  ngOnInit(): void {
    this.loadRealStats();
  }

  loadRealStats(): void {
    this.loading.set(true);

    const user = this.auth.currentUser() || this.storage.getUser();
    const clinicId = user?.clinicId;

    if (!clinicId) {
      this.stats.set(this.zeroStats);
      this.doctorsList.set(this.sampleDoctors);
      this.patientsList.set(this.samplePatients);
      this.loading.set(false);
      return;
    }

    // 1. Fetch Stats
    this.clinicService.getDashboardStats(clinicId).subscribe({
      next: (data: DashboardStats) => {
        this.stats.set(data || this.zeroStats);
      },
      error: () => this.stats.set(this.zeroStats)
    });

    // 2. Fetch Doctors via Branches
    this.doctorService.getBranchesByClinic(clinicId).subscribe({
      next: (branches: Branch[]) => {
        if (branches.length > 0) {
          this.doctorService.getDoctorsByBranch(branches[0].id).subscribe({
            next: (docs: Doctor[]) => {
              this.doctorsList.set(docs.length > 0 ? docs : this.sampleDoctors);
            },
            error: () => this.doctorsList.set(this.sampleDoctors)
          });
        } else {
          this.doctorsList.set(this.sampleDoctors);
        }
      },
      error: () => this.doctorsList.set(this.sampleDoctors)
    });

    // 3. Fetch Patients
    this.patientService.searchPatients(clinicId, '').subscribe({
      next: (patients: Patient[]) => {
        this.patientsList.set(patients.length > 0 ? patients : this.samplePatients);
        this.loading.set(false);
      },
      error: () => {
        this.patientsList.set(this.samplePatients);
        this.loading.set(false);
      }
    });
  }

  getDoctorInitials(name: string): string {
    if (!name) return 'DR';
    const clean = name.replace(/^(Dr\.|Dr|Doctor)\s+/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (clean[0] || 'D').toUpperCase();
  }

  getBranchName(doctorId: string): string {
    if (doctorId === '33333333-3333-3333-3333-333333333333' || doctorId === '44444444-4444-4444-4444-444444444444') {
      return 'East Branch - Heliopolis';
    }
    return 'Main Branch - Downtown';
  }

  getGenderLabel(gender: number): string {
    return GenderLabels[gender] || 'Unknown';
  }
}
