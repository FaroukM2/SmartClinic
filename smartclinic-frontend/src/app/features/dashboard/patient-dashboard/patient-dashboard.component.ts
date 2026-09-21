import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { ClinicService } from '../../../core/services/clinic.service';
import { Doctor, Branch, Specialization } from '../../../core/models/doctor.models';

interface PatientPrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  doctorName: string;
  date: string;
}

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="patient-dashboard animate-fade">
      <!-- Top Welcome Banner -->
      <div class="patient-hero mb-6">
        <div class="hero-content">
          <div class="d-flex align-center gap-2 mb-2">
            <span class="badge badge-primary">🏥 SmartClinic Patient Portal</span>
            <span class="badge badge-success"><span class="dot"></span> Verified Patient Profile</span>
          </div>
          <h1 style="margin:0 0 6px; font-size:1.6rem">Welcome, {{ patientName() }}</h1>
          <p class="text-muted fs-sm" style="margin:0 0 16px">
            Your personal digital healthcare portal. Easily book clinic visits, check your queue status, and review medical prescriptions.
          </p>

          <div class="d-flex gap-3 align-center flex-wrap">
            <button class="btn btn-primary" (click)="openBookingModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Book New Doctor Appointment
            </button>
            <a routerLink="/doctors" class="btn btn-secondary">
              🩺 Explore Clinic Doctors
            </a>
          </div>
        </div>

        <div class="patient-code-card">
          <span class="fs-xs text-muted">Digital Medical ID</span>
          <div class="medical-code">P-1001</div>
          <span class="fs-xs text-muted">Clinic: SmartClinic Central</span>
        </div>
      </div>

      <!-- Main Portal Grid -->
      <div class="portal-grid mb-6">
        <!-- Upcoming Appointment Card -->
        <div class="card app-focus-card">
          <div class="card__header d-flex justify-between align-center">
            <div class="d-flex align-center gap-2">
              <span>📅</span>
              <span class="fw-700 fs-md">Next Scheduled Consultation</span>
            </div>
            <span class="badge badge-warning"><span class="dot"></span> Confirmed Reservation</span>
          </div>

          <div class="card__body">
            @if (nextAppointment()) {
              <div class="app-details-grid">
                <div class="app-detail-item">
                  <span class="text-muted fs-xs">Medical Specialist</span>
                  <div class="fw-700 fs-md" style="color:var(--primary-light)">
                    {{ nextAppointment()!.doctorName }}
                  </div>
                  <span class="badge badge-primary" style="margin-top:4px">
                    {{ nextAppointment()!.specialization }}
                  </span>
                </div>

                <div class="app-detail-item">
                  <span class="text-muted fs-xs">Branch Location</span>
                  <div class="fw-600 fs-sm">📍 {{ nextAppointment()!.branchName }}</div>
                  <span class="text-muted fs-xs">Downtown Clinic, 2nd Floor</span>
                </div>

                <div class="app-detail-item">
                  <span class="text-muted fs-xs">Appointment Time</span>
                  <div class="fw-600 fs-sm">🕒 {{ nextAppointment()!.date }} - 10:30 AM</div>
                  <span class="text-muted fs-xs">Queue Position: #{{ nextAppointment()!.queueNumber }}</span>
                </div>

                <div class="app-detail-item">
                  <span class="text-muted fs-xs">Status</span>
                  <div>
                    <span class="badge badge-warning">Waiting in Reception</span>
                  </div>
                  <span class="text-muted fs-xs" style="margin-top:4px">Please arrive 10 mins early</span>
                </div>
              </div>
            } @else {
              <div class="empty-state" style="padding:24px">
                <div class="empty-icon">📅</div>
                <h3>No Upcoming Appointments</h3>
                <p>You have no scheduled doctor consultations at this time.</p>
                <button class="btn btn-primary btn-sm" (click)="openBookingModal()">Book a Visit Now</button>
              </div>
            }
          </div>
        </div>

        <!-- Medical Records & Prescriptions Summary -->
        <div class="card">
          <div class="card__header d-flex justify-between align-center">
            <div class="d-flex align-center gap-2">
              <span>💊</span>
              <span class="fw-700 fs-md">Recent E-Prescriptions</span>
            </div>
            <span class="badge badge-primary">Active E-Rx</span>
          </div>

          <div class="card__body" style="padding:0">
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage & Frequency</th>
                    <th>Doctor</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rx of prescriptions(); track rx.medicineName) {
                    <tr>
                      <td>
                        <div class="fw-600 fs-sm" style="color:var(--primary-light)">{{ rx.medicineName }}</div>
                        <span class="text-muted fs-xs">{{ rx.date }}</span>
                      </td>
                      <td>
                        <div class="fs-xs fw-600">{{ rx.dosage }}</div>
                        <span class="text-muted fs-xs">{{ rx.frequency }}</span>
                      </td>
                      <td class="fs-xs">{{ rx.doctorName }}</td>
                      <td class="fs-xs text-muted">{{ rx.instructions }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Clinic Doctors Directory Section -->
      <div class="card">
        <div class="card__header d-flex justify-between align-center">
          <div>
            <h3 style="margin:0 0 2px;font-size:1.05rem">👨‍⚕️ Available Clinic Doctors & Specialists</h3>
            <p class="text-muted fs-xs" style="margin:0">Browse medical consultants and easily schedule an appointment</p>
          </div>
          <a routerLink="/doctors" class="btn btn-secondary btn-sm">Full Staff Directory &rarr;</a>
        </div>

        <div class="card__body">
          @if (loadingDoctors()) {
            <div class="loading-container" style="padding:32px">
              <div class="spinner"></div>
              <span>Loading clinic doctors...</span>
            </div>
          } @else {
            <div class="docs-showcase-grid">
              @for (doc of doctorsList(); track doc.id) {
                <div class="patient-doc-card">
                  <div class="avatar avatar-md" style="background:rgba(13,148,136,0.15);color:var(--primary-light);font-size:1.3rem">
                    🩺
                  </div>
                  <div class="doc-meta">
                    <h4 style="margin:0;font-size:0.95rem">{{ doc.fullName }}</h4>
                    <span class="badge badge-primary fs-xs" style="margin-top:3px">{{ doc.specializationName || 'Specialist' }}</span>
                    <div class="fs-xs text-muted" style="margin-top:6px">
                      Fee: <strong style="color:var(--text-primary)">{{ (doc.consultationFee || 350) | currency:'EGP':'symbol':'1.0-0' }}</strong>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-sm" (click)="bookWithDoctor(doc)">
                    Book Visit
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Modal: Fast Appointment Booking -->
      @if (showBookingModal()) {
        <div class="modal-backdrop animate-fade" (click)="closeBookingModal()">
          <div class="modal-card animate-scale" (click)="$event.stopPropagation()">
            <div class="modal-header d-flex justify-between align-center">
              <h3>🗓️ Book Clinic Appointment</h3>
              <button class="close-btn" (click)="closeBookingModal()">&times;</button>
            </div>

            <div class="modal-body">
              @if (bookingSuccess()) {
                <div class="alert alert-success">
                  🎉 Appointment booked successfully! Your queue number is <strong>#{{ bookedQueueNum() }}</strong>. We look forward to seeing you.
                </div>
              } @else {
                <form (ngSubmit)="confirmBooking()">
                  <div class="form-group mb-3">
                    <label>Selected Doctor</label>
                    <select class="form-control" [(ngModel)]="bookingDocId" name="docId" required>
                      @for (d of doctorsList(); track d.id) {
                        <option [value]="d.id">{{ d.fullName }} — {{ d.specializationName || 'Specialist' }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group mb-3">
                    <label>Preferred Date</label>
                    <input type="date" class="form-control" [(ngModel)]="bookingDate" name="bDate" required />
                  </div>

                  <div class="form-group mb-4">
                    <label>Symptoms / Consultation Notes</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="bookingNotes" name="notes" placeholder="Briefly describe your symptoms or reason for visit..."></textarea>
                  </div>

                  <div class="d-flex justify-between align-center">
                    <button type="button" class="btn btn-secondary" (click)="closeBookingModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" [disabled]="bookingLoading()">
                      @if (bookingLoading()) {
                        <span class="spinner" style="width:16px;height:16px"></span> Confirming...
                      } @else {
                        Confirm & Reserve Slot
                      }
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .patient-hero {
      background: var(--hero-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 28px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      transition: background 0.3s ease;
    }
    .patient-code-card {
      background: var(--card-subtle-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      text-align: center;
      min-width: 170px;
    }
    .medical-code {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-light);
      letter-spacing: 1px;
      margin: 4px 0;
    }
    .portal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .app-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .app-detail-item {
      background: var(--surface-2);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .docs-showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .patient-doc-card {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      transition: var(--transition);
      &:hover {
        transform: translateY(-2px);
        border-color: var(--primary);
      }
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      max-width: 480px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      h3 { margin: 0; font-size: 1.15rem; }
    }
    .modal-body {
      padding: 24px;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      &:hover { color: var(--text-primary); }
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  loadingDoctors = signal(true);
  doctorsList    = signal<Doctor[]>([]);
  showBookingModal = signal(false);
  bookingLoading   = signal(false);
  bookingSuccess   = signal(false);
  bookedQueueNum   = signal(1);

  bookingDocId = '';
  bookingDate  = new Date().toISOString().split('T')[0];
  bookingNotes = '';

  readonly patientName = computed(() => this.auth.currentUser()?.fullName ?? 'Patient');

  // Sample Next Appointment for visual excellence
  nextAppointment = signal<{
    doctorName: string;
    specialization: string;
    branchName: string;
    date: string;
    queueNumber: number;
  } | null>({
    doctorName: 'Dr. Tamer Hosny',
    specialization: 'Consultant Cardiologist',
    branchName: 'Downtown Central Clinic',
    date: new Date().toISOString().split('T')[0],
    queueNumber: 2
  });

  // Sample Prescriptions for visual excellence
  prescriptions = signal<PatientPrescriptionItem[]>([
    {
      medicineName: 'Concor Cor 2.5mg',
      dosage: '1 Tablet',
      frequency: 'Once Daily (Morning)',
      duration: '30 Days',
      instructions: 'Take after breakfast with a full glass of water',
      doctorName: 'Dr. Tamer Hosny',
      date: '2026-09-18'
    },
    {
      medicineName: 'Panadol Extra 500mg',
      dosage: '2 Tablets',
      frequency: 'Every 8 Hours',
      duration: '5 Days',
      instructions: 'Take when needed for headache or fever',
      doctorName: 'Dr. Sarah Mansour',
      date: '2026-09-10'
    }
  ]);

  constructor(
    private auth: AuthService,
    private doctorService: DoctorService,
    private clinicService: ClinicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loadingDoctors.set(true);
    const clinicId = this.auth.clinicId();
    if (!clinicId) {
      this.loadingDoctors.set(false);
      return;
    }

    this.doctorService.getBranchesByClinic(clinicId).subscribe({
      next: (branches) => {
        if (branches.length > 0) {
          this.doctorService.getDoctorsByBranch(branches[0].id).subscribe({
            next: (docs) => {
              this.doctorsList.set(docs);
              if (docs.length > 0) this.bookingDocId = docs[0].id;
              this.loadingDoctors.set(false);
            },
            error: () => this.loadingDoctors.set(false)
          });
        } else {
          this.loadingDoctors.set(false);
        }
      },
      error: () => this.loadingDoctors.set(false)
    });
  }

  openBookingModal(): void {
    this.bookingSuccess.set(false);
    this.showBookingModal.set(true);
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
  }

  bookWithDoctor(doc: Doctor): void {
    this.bookingDocId = doc.id;
    this.openBookingModal();
  }

  confirmBooking(): void {
    this.bookingLoading.set(true);
    setTimeout(() => {
      this.bookingLoading.set(false);
      this.bookedQueueNum.set(RandomNum(3, 9));
      this.bookingSuccess.set(true);
      setTimeout(() => {
        this.closeBookingModal();
      }, 2500);
    }, 800);
  }
}

function RandomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
