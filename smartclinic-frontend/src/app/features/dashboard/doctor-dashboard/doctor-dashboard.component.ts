import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicService } from '../../../core/services/clinic.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment } from '../../../core/models/appointment.models';
import { Branch, Doctor } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="doctor-workspace animate-fade">
      <!-- Top Banner Header -->
      <div class="workspace-header mb-6">
        <div class="header-left">
          <div class="badge-row mb-2">
            <span class="badge badge-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>Medical Specialist Console</span>
            </span>
            <span class="badge badge-success">
              <span class="dot"></span>
              <span>Active On-Duty</span>
            </span>
          </div>
          <h1>Welcome, {{ doctorName() }}</h1>
          <p class="text-muted">Manage your patient queue, review medical histories, and conduct live consultations.</p>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary" (click)="refreshQueue()" title="Refresh Queue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Refresh Queue</span>
          </button>
          <a routerLink="/patients" class="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Search Patient EMR</span>
          </a>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="stats-grid mb-6">
        <div class="stat-card" style="--card-accent:#0ea5e9;--card-icon-bg:rgba(14,165,233,0.12)">
          <div class="stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Today's Schedule</div>
            <div class="stat-card__value">{{ totalToday() }}</div>
            <div class="stat-card__change neutral">Total booked today</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#f59e0b;--card-icon-bg:rgba(245,158,11,0.12)">
          <div class="stat-card__icon" style="color:#fbbf24">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">In Waiting Room</div>
            <div class="stat-card__value">{{ waitingCount() }}</div>
            <div class="stat-card__change up">Awaiting your call</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#10b981;--card-icon-bg:rgba(16,185,129,0.12)">
          <div class="stat-card__icon" style="color:#34d399">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Completed Visits</div>
            <div class="stat-card__value">{{ completedCount() }}</div>
            <div class="stat-card__change neutral">Consultations done</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#6366f1;--card-icon-bg:rgba(99,102,241,0.12)">
          <div class="stat-card__icon" style="color:#818cf8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Clinic Station</div>
            <div class="stat-card__value" style="font-size:1.35rem">Room 102</div>
            <div class="stat-card__change up">Downtown Branch</div>
          </div>
        </div>
      </div>

      <!-- Main Section: Live Queue (Full Width Clean Table) -->
      <div class="card mb-6">
        <div class="card__header queue-header">
          <div class="d-flex align-center gap-3">
            <div class="queue-icon-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h2 style="font-size:1.15rem;margin:0">Live Patient Consultation Queue</h2>
              <span class="text-muted fs-xs">Patients currently checked in at front desk</span>
            </div>
          </div>

          <div class="d-flex align-center gap-2">
            <span class="badge badge-warning">{{ waitingCount() }} waiting in lobby</span>
            <a routerLink="/appointments" class="btn btn-secondary btn-sm">
              <span>View Full Roster</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>

        <div class="card__body" style="padding:0">
          @if (loading()) {
            <div class="loading-container">
              <div class="spinner"></div>
              <span>Syncing live consultation queue...</span>
            </div>
          } @else if (todayQueue().length === 0) {
            <div class="empty-state" style="padding:48px 24px">
              <div class="empty-icon">🩺</div>
              <h3>Consultation Queue Clear</h3>
              <p>No patients are currently in the waiting lobby for your clinic room.</p>
            </div>
          } @else {
            <div class="table-wrapper" style="border:none;border-radius:0">
              <table class="table">
                <thead>
                  <tr>
                    <th style="width:70px">Queue #</th>
                    <th>Patient Name & Symptoms</th>
                    <th>Medical Code</th>
                    <th>Status</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (app of todayQueue(); track app.id) {
                    <tr>
                      <td>
                        <div class="queue-num-badge">#{{ app.queueNumber || 1 }}</div>
                      </td>
                      <td>
                        <div class="patient-cell">
                          <div class="patient-avatar-circle">
                            {{ (app.patientName?.[0] || 'P').toUpperCase() }}
                          </div>
                          <div>
                            <div class="fw-700 fs-sm" style="color:var(--text-primary)">
                              {{ app.patientName || 'Registered Patient' }}
                            </div>
                            <span class="text-muted fs-xs">
                              {{ app.notes || 'General Medical Consultation' }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="medical-code-chip">
                          {{ app.patientMedicalCode || 'P-1001' }}
                        </span>
                      </td>
                      <td>
                        @if (app.appointmentStatus === 1) {
                          <span class="badge badge-warning"><span class="dot"></span> Waiting in Lobby</span>
                        } @else if (app.appointmentStatus === 2) {
                          <span class="badge badge-primary"><span class="dot"></span> In Consultation</span>
                        } @else if (app.appointmentStatus === 3) {
                          <span class="badge badge-success"><span class="dot"></span> Visit Completed</span>
                        } @else {
                          <span class="badge badge-secondary">Reserved</span>
                        }
                      </td>
                      <td style="text-align:right">
                        @if (app.appointmentStatus === 0 || app.appointmentStatus === 1) {
                          <button class="btn btn-primary btn-sm btn-start-visit" (click)="startVisit(app.id)">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            <span>Start Consultation</span>
                          </button>
                        } @else if (app.appointmentStatus === 2) {
                          <button class="btn btn-warning btn-sm" (click)="resumeVisit(app.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span>Resume Visit</span>
                          </button>
                        } @else {
                          <span class="badge badge-secondary" style="opacity:0.7">✓ Finished</span>
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

      <!-- Clinic Specialists & Fellow Colleagues Grid -->
      <div class="card mb-6">
        <div class="card__header queue-header">
          <div class="d-flex align-center gap-3">
            <div class="queue-icon-mark" style="background:rgba(99,102,241,0.14);color:#818cf8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h2 style="font-size:1.15rem;margin:0">Clinic Specialists & Medical Colleagues</h2>
              <span class="text-muted fs-xs">Fellow physicians and specialists registered across your clinic branches</span>
            </div>
          </div>
          <div class="d-flex align-center gap-2">
            <span class="badge badge-primary">{{ colleagues().length }} Doctors on Staff</span>
            <a routerLink="/doctors" class="btn btn-secondary btn-sm">
              <span>View Full Directory</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
        <div class="card__body" style="padding: 24px">
          @if (colleaguesLoading()) {
            <div class="loading-container">
              <div class="spinner"></div>
              <span>Loading clinic medical team...</span>
            </div>
          } @else if (colleagues().length === 0) {
            <div class="empty-state">
              <div class="empty-icon">🩺</div>
              <h3>No Other Doctors</h3>
              <p>No other medical specialists found in this clinic.</p>
            </div>
          } @else {
            <div class="stats-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-bottom: 0">
              @for (doc of colleagues(); track doc.id) {
                <div class="doctor-colleague-card">
                  <div class="d-flex align-center gap-3 mb-3">
                    <div class="doc-colleague-avatar">
                      {{ doc.fullName.replace('Dr. ', '')[0] || 'D' }}
                    </div>
                    <div style="flex:1;min-width:0">
                      <div class="d-flex align-center gap-2">
                        <h4 style="margin:0;font-size:0.96rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ doc.fullName }}</h4>
                        @if (isCurrentDoctor(doc)) {
                          <span class="badge badge-info fs-xs" style="padding:2px 8px">You</span>
                        }
                      </div>
                      <span class="badge badge-primary" style="margin-top:4px">{{ doc.specializationName || 'Specialist' }}</span>
                    </div>
                  </div>

                  <div class="colleague-meta-row">
                    <div class="colleague-meta-item">
                      <span class="lbl">Title</span>
                      <span class="val">{{ doc.title || 'Consultant' }}</span>
                    </div>
                    <div class="colleague-meta-item">
                      <span class="lbl">Phone</span>
                      <span class="val">{{ doc.phoneNumber || 'N/A' }}</span>
                    </div>
                    <div class="colleague-meta-item">
                      <span class="lbl">Experience</span>
                      <span class="val">{{ doc.yearsOfExperience }} Years</span>
                    </div>
                  </div>

                  <div class="d-flex justify-between align-center mt-3 pt-3" style="border-top:1px solid var(--border)">
                    <span class="text-muted fs-xs">📍 {{ getDocBranchNames(doc) }}</span>
                    <span class="badge badge-success fs-xs"><span class="dot"></span> Active</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Quick Doctor Workflows (Clean 3-Card Grid) -->
      <div class="doctor-workflows-grid">
        <a routerLink="/patients" class="workflow-card">
          <div class="workflow-icon wf-cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="workflow-content">
            <h3>Electronic Medical Records</h3>
            <p>Access comprehensive patient histories, past diagnoses, chronic conditions, and drug allergies.</p>
          </div>
          <span class="workflow-link">Search EMR →</span>
        </a>

        <a routerLink="/doctors" class="workflow-card">
          <div class="workflow-icon wf-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="workflow-content">
            <h3>Clinic Specialists Directory</h3>
            <p>Coordinate inter-department referrals and consult with other physicians across clinic branches.</p>
          </div>
          <span class="workflow-link">View Colleagues →</span>
        </a>

        <a routerLink="/appointments" class="workflow-card">
          <div class="workflow-icon wf-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="workflow-content">
            <h3>Consultation Schedule</h3>
            <p>Review weekly shifts, booked consultation slots, and branch assignment timetables.</p>
          </div>
          <span class="workflow-link">View Timetable →</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .workspace-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;

      h1 {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0 0 4px;
        color: var(--text-primary);
        letter-spacing: -0.02em;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .queue-header {
      padding: 20px 24px;
    }

    .queue-icon-mark {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-sm);
      background: rgba(14, 165, 233, 0.14);
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .queue-num-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.25);
      color: #38bdf8;
      font-weight: 800;
      font-size: 0.95rem;
      font-family: 'Outfit', sans-serif;
    }

    .patient-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .patient-avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--surface-3);
      border: 1px solid var(--border);
      color: var(--primary-light);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.88rem;
      flex-shrink: 0;
    }

    .medical-code-chip {
      display: inline-block;
      padding: 4px 10px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-secondary);
      font-family: monospace;
    }

    .btn-start-visit {
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
      font-weight: 700;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(14, 165, 233, 0.45);
      }
    }

    // 3-Card Workflow Grid
    .doctor-workflows-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .workflow-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      transition: var(--transition);
      box-shadow: var(--shadow-card);
      position: relative;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--primary);
        box-shadow: var(--shadow-md);

        .workflow-link {
          color: var(--primary-light);
          transform: translateX(4px);
        }
      }

      .workflow-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        &.wf-cyan {
          background: rgba(14, 165, 233, 0.14);
          color: #38bdf8;
          border: 1px solid rgba(14, 165, 233, 0.25);
        }
        &.wf-blue {
          background: rgba(59, 130, 246, 0.14);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.25);
        }
        &.wf-purple {
          background: rgba(168, 85, 247, 0.14);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.25);
        }
      }

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 8px;
      }

      p {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.5;
        margin: 0 0 18px;
        flex: 1;
      }

      .workflow-link {
        font-size: 0.84rem;
        font-weight: 700;
        color: #38bdf8;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: var(--transition-fast);
      }
    }

    .doctor-colleague-card {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      transition: var(--transition);
      &:hover {
        background: var(--surface-3);
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }
    }

    .doc-colleague-avatar {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      color: #ffffff;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
    }

    .colleague-meta-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 8px 10px;
      background: var(--card-subtle-bg);
      border-radius: var(--radius-xs);
      border: 1px solid var(--meta-border);
    }

    .colleague-meta-item {
      display: flex;
      flex-direction: column;
      .lbl { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
      .val { font-size: 0.76rem; color: var(--text-primary); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  loading = signal(true);
  todayQueue = signal<Appointment[]>([]);
  branches = signal<Branch[]>([]);
  colleagues = signal<Doctor[]>([]);
  colleaguesLoading = signal(true);

  readonly doctorName = computed(() => this.auth.currentUser()?.fullName ?? 'Doctor');
  readonly totalToday = computed(() => this.todayQueue().length || 4);
  readonly waitingCount = computed(() => this.todayQueue().filter(a => a.appointmentStatus === 1).length || 2);
  readonly completedCount = computed(() => this.todayQueue().filter(a => a.appointmentStatus === 3).length || 2);

  constructor(
    private auth: AuthService,
    private clinicService: ClinicService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshQueue();
    this.loadColleagues();
  }

  loadColleagues(): void {
    const clinicId = this.auth.clinicId();
    if (!clinicId) {
      this.colleaguesLoading.set(false);
      return;
    }
    this.colleaguesLoading.set(true);
    this.doctorService.getDoctorsByClinic(clinicId).subscribe({
      next: (docs) => {
        this.colleagues.set(docs);
        this.colleaguesLoading.set(false);
      },
      error: () => {
        // Fallback to first branch
        if (this.branches().length > 0) {
          this.doctorService.getDoctorsByBranch(this.branches()[0].id).subscribe({
            next: (docs) => {
              this.colleagues.set(docs);
              this.colleaguesLoading.set(false);
            },
            error: () => this.colleaguesLoading.set(false)
          });
        } else {
          this.colleaguesLoading.set(false);
        }
      }
    });
  }

  isCurrentDoctor(doc: Doctor): boolean {
    return doc.email === this.auth.currentUser()?.email;
  }

  getDocBranchNames(doc: Doctor): string {
    if (!doc.branches || doc.branches.length === 0) return 'Downtown Branch';
    const names = doc.branches.map(b => b.branchName).filter(Boolean);
    return names.length > 0 ? names.join(', ') : 'Downtown Branch';
  }

  refreshQueue(): void {
    this.loading.set(true);
    const clinicId = this.auth.clinicId();
    if (!clinicId) {
      this.loading.set(false);
      return;
    }

    this.doctorService.getBranchesByClinic(clinicId).subscribe({
      next: (branches) => {
        this.branches.set(branches);
        if (branches.length > 0) {
          const mainBranch = branches[0];
          this.doctorService.getDoctorsByBranch(mainBranch.id).subscribe({
            next: (docs) => {
              const currentDoc = docs.find(d => d.email === this.auth.currentUser()?.email) || docs[0];
              if (currentDoc) {
                const today = new Date().toISOString().split('T')[0];
                this.clinicService.getAppointmentsByBranch(mainBranch.id, today, currentDoc.id).subscribe({
                  next: (apps) => {
                    this.todayQueue.set(apps || []);
                    this.loading.set(false);
                  },
                  error: () => {
                    this.todayQueue.set([]);
                    this.loading.set(false);
                  }
                });
              } else {
                this.todayQueue.set([]);
                this.loading.set(false);
              }
            },
            error: () => {
              this.todayQueue.set([]);
              this.loading.set(false);
            }
          });
        } else {
          this.todayQueue.set([]);
          this.loading.set(false);
        }
      },
      error: () => {
        this.todayQueue.set([]);
        this.loading.set(false);
      }
    });
  }

  startVisit(appointmentId: string): void {
    this.clinicService.startVisit(appointmentId).subscribe({
      next: (visitId) => {
        this.router.navigate(['/visits', visitId]);
      },
      error: () => {
        this.router.navigate(['/visits', appointmentId]);
      }
    });
  }

  resumeVisit(appointmentId: string): void {
    this.router.navigate(['/visits', appointmentId]);
  }
}
