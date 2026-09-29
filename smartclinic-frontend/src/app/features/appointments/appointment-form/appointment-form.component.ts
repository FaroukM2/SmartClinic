import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ClinicService } from '../../../core/services/clinic.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient } from '../../../core/models/patient.models';
import { Branch, Doctor } from '../../../core/models/doctor.models';
import { AvailableTimeSlot, ConsultationTypes } from '../../../core/models/appointment.models';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Book New Appointment</h1>
        <p>Schedule a patient appointment with real-time doctor availability and time slot allocation</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/appointments" class="btn btn-secondary">← Back to Queue</a>
      </div>
    </div>

    <div class="booking-grid">
      <!-- Main Booking Form -->
      <div class="booking-form-col">
        <div class="card">
          <div class="card__body">
            @if (error()) {
              <div class="alert alert-danger mb-4">{{ error() }}</div>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- Step 1: Patient & Consultation Type -->
              <div class="section-title">
                <span class="step-badge">1</span>
                <h3>Patient & Service</h3>
              </div>

              <div class="form-row mb-4">
                <div class="form-group flex-1">
                  <label>Select Patient *</label>
                  <select class="form-control" formControlName="patientId">
                    <option value="">-- Choose Patient --</option>
                    @for (p of patients(); track p.id) {
                      <option [value]="p.id">
                        {{ p.fullName }} ({{ p.primaryPhone || p.medicalCode }})
                      </option>
                    }
                  </select>
                </div>
                <div class="quick-action" style="align-self:flex-end;margin-bottom:8px">
                  <a routerLink="/patients/new" class="btn btn-secondary btn-sm" title="Register new patient">
                    + New Patient
                  </a>
                </div>
              </div>

              <div class="form-group mb-6">
                <label>Consultation Type</label>
                <div class="type-selector">
                  @for (t of consultationTypes; track t.id) {
                    <button
                      type="button"
                      class="type-chip"
                      [class.active]="selectedConsultationType() === t.id"
                      (click)="setConsultationType(t.id)"
                    >
                      <span class="type-icon">{{ t.id === 1 ? '🩺' : '🔄' }}</span>
                      <span class="type-name">{{ t.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <hr class="divider" />

              <!-- Step 2: Branch & Doctor -->
              <div class="section-title">
                <span class="step-badge">2</span>
                <h3>Branch & Doctor</h3>
              </div>

              <div class="form-row mb-4">
                <div class="form-group flex-1">
                  <label>Branch *</label>
                  <select class="form-control" formControlName="branchId" (change)="onBranchSelect($event)">
                    <option value="">-- Select Branch --</option>
                    @for (b of branches(); track b.id) {
                      <option [value]="b.id">{{ b.name }}</option>
                    }
                  </select>
                </div>

                <div class="form-group flex-1">
                  <label>Doctor *</label>
                  <select class="form-control" formControlName="doctorId" (change)="onDoctorSelect()">
                    <option value="">-- Select Doctor --</option>
                    @for (d of doctors(); track d.id) {
                      <option [value]="d.id">
                        {{ d.fullName }} — {{ d.specializationName || d.title || 'Specialist' }}
                      </option>
                    }
                  </select>
                </div>
              </div>

              <hr class="divider" />

              <!-- Step 3: Date & Time Slots (Inspired by Nabd) -->
              <div class="section-title">
                <span class="step-badge">3</span>
                <h3>Date & Time Slot</h3>
              </div>

              <div class="form-group mb-4" style="max-width:300px">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  class="form-control"
                  formControlName="appointmentDate"
                  [min]="minDate"
                  (change)="loadAvailableSlots()"
                />
              </div>

              <!-- Available Slots Section -->
              <div class="slots-container mb-6">
                <div class="d-flex justify-between align-center mb-3">
                  <label class="mb-0 fw-600">Available Time Slots</label>
                  <div class="slots-stats">
                    <span class="badge badge-success">{{ availableSlotsCount() }} Available</span>
                    <span class="badge badge-secondary">{{ bookedSlotsCount() }} Booked</span>
                  </div>
                </div>

                @if (loadingSlots()) {
                  <div class="slots-loading">
                    <div class="spinner" style="width:20px;height:20px"></div>
                    <span>Checking doctor schedule and booked slots...</span>
                  </div>
                } @else if (availableSlots().length === 0) {
                  <div class="slots-empty">
                    <p class="text-muted fs-sm mb-0">
                      Please select a doctor and date to view available time slots.
                    </p>
                  </div>
                } @else {
                  <div class="slots-grid">
                    @for (slot of availableSlots(); track slot.time) {
                      <button
                        type="button"
                        class="slot-btn"
                        [class.selected]="selectedSlot() === slot.time"
                        [class.booked]="slot.isBooked"
                        [class.past]="slot.isPast"
                        [disabled]="!slot.isAvailable"
                        (click)="selectSlot(slot.time)"
                      >
                        <span class="slot-clock">⏰</span>
                        <span class="slot-time" [class.line-through]="slot.isBooked">{{ slot.displayTime }}</span>
                        @if (selectedSlot() === slot.time) {
                          <span class="slot-check">✓</span>
                        }
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- Step 4: Notes / Reason for Visit -->
              <div class="form-group mb-6">
                <label>Notes / Reason for Visit (Optional)</label>
                <textarea
                  class="form-control"
                  rows="2"
                  formControlName="notes"
                  placeholder="e.g., Routine checkup, throat pain, follow-up on test results"
                ></textarea>
              </div>

              <!-- Actions -->
              <div class="form-actions">
                <a routerLink="/appointments" class="btn btn-secondary">Cancel</a>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="loading() || form.invalid || !selectedSlot()"
                >
                  @if (loading()) {
                    <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
                    Booking Appointment...
                  } @else {
                    Confirm Booking
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Summary Sidebar Card -->
      <div class="booking-summary-col">
        <div class="card summary-card sticky-card">
          <div class="card__body">
            <h3 class="summary-title">Booking Summary</h3>
            <p class="text-muted fs-xs mb-4">Review appointment details prior to confirmation</p>

            <div class="summary-item">
              <span class="summary-label">Patient</span>
              <span class="summary-val">{{ selectedPatientName() || 'Not selected' }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Doctor</span>
              <span class="summary-val">{{ selectedDoctorName() || 'Not selected' }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Branch</span>
              <span class="summary-val">{{ selectedBranchName() || 'Not selected' }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Consultation Type</span>
              <span class="summary-val">{{ selectedConsultationTypeName() }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Date</span>
              <span class="summary-val">{{ form.get('appointmentDate')?.value || '—' }}</span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Selected Time</span>
              <span class="summary-val text-primary-dark fw-700">
                {{ selectedSlotDisplay() || 'Choose time slot' }}
              </span>
            </div>

            <hr class="divider my-4" />

            <div class="summary-item fee-item">
              <span class="summary-label">Consultation Fee</span>
              <span class="summary-price">{{ estimatedFee() }} EGP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .booking-grid {
        grid-template-columns: 1fr;
      }
    }
    .sticky-card {
      position: sticky;
      top: 80px;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .section-title h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0;
    }
    .step-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .flex-1 { flex: 1; min-width: 220px; }
    .divider {
      border: 0;
      border-top: 1px solid var(--border-color);
      margin: 20px 0;
    }
    .type-selector {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .type-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: var(--text-main);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .type-chip:hover {
      border-color: var(--primary);
    }
    .type-chip.active {
      border-color: var(--primary);
      background: rgba(37, 99, 235, 0.08);
      color: var(--primary);
      font-weight: 600;
    }
    .slots-container {
      background: var(--bg-subtle, #f8fafc);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
    }
    .slots-stats {
      display: flex;
      gap: 8px;
    }
    .slots-loading, .slots-empty {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px;
      justify-content: center;
    }
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 10px;
    }
    .slot-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      transition: all 0.15s ease;
    }
    .slot-btn:hover:not(:disabled) {
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    .slot-btn.selected {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }
    .slot-btn.booked, .slot-btn.past {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
      cursor: not-allowed;
    }
    .line-through {
      text-decoration: line-through;
    }
    .slot-check {
      font-weight: bold;
      font-size: 0.9rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    .summary-card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }
    .summary-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 4px;
      color: var(--text-heading);
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 0.875rem;
    }
    .summary-label {
      color: var(--text-muted);
    }
    .summary-val {
      font-weight: 600;
      text-align: right;
      max-width: 170px;
    }
    .fee-item {
      align-items: center;
    }
    .summary-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #10b981;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clinicService = inject(ClinicService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form: FormGroup;
  patients = signal<Patient[]>([]);
  branches = signal<Branch[]>([]);
  doctors  = signal<Doctor[]>([]);
  availableSlots = signal<AvailableTimeSlot[]>([]);

  selectedSlot = signal<string>('09:00');
  selectedConsultationType = signal<number>(1);
  loading = signal(false);
  loadingSlots = signal(false);
  error = signal('');

  readonly minDate = new Date().toISOString().split('T')[0];
  readonly consultationTypes = ConsultationTypes;

  availableSlotsCount = computed(() => this.availableSlots().filter(s => s.isAvailable).length);
  bookedSlotsCount = computed(() => this.availableSlots().filter(s => s.isBooked).length);

  selectedPatientName = computed(() => {
    const pid = this.form.get('patientId')?.value;
    const p = this.patients().find(x => x.id === pid);
    return p ? p.fullName : '';
  });

  selectedDoctorName = computed(() => {
    const did = this.form.get('doctorId')?.value;
    const d = this.doctors().find(x => x.id === did);
    return d ? d.fullName : '';
  });

  selectedBranchName = computed(() => {
    const bid = this.form.get('branchId')?.value;
    const b = this.branches().find(x => x.id === bid);
    return b ? b.name : '';
  });

  selectedConsultationTypeName = computed(() => {
    const t = this.consultationTypes.find(x => x.id === this.selectedConsultationType());
    return t ? t.name : 'Examination';
  });

  selectedSlotDisplay = computed(() => {
    const slot = this.availableSlots().find(s => s.time === this.selectedSlot());
    return slot ? slot.displayTime : this.selectedSlot();
  });

  estimatedFee = computed(() => {
    const did = this.form.get('doctorId')?.value;
    const d = this.doctors().find(x => x.id === did);
    const baseFee = d?.consultationFee || 350;
    return this.selectedConsultationType() === 2 ? Math.round(baseFee * 0.5) : baseFee;
  });

  constructor() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      branchId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: [this.minDate, Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const cid = this.auth.clinicId();
    if (!cid) return;

    // Load patients
    this.patientService.searchPatients(cid).subscribe({
      next: (res) => this.patients.set(res || [])
    });

    // Load branches
    this.doctorService.getBranchesByClinic(cid).subscribe({
      next: (bList) => {
        this.branches.set(bList || []);
        if (bList && bList.length > 0) {
          const defaultBranchId = bList[0].id;
          this.form.patchValue({ branchId: defaultBranchId });
          this.loadDoctorsForBranch(defaultBranchId);
        }
      }
    });

    const presetPatientId = this.route.snapshot.queryParams['patientId'];
    if (presetPatientId) {
      this.form.patchValue({ patientId: presetPatientId });
    }
  }

  onBranchSelect(event: any): void {
    const branchId = event.target.value;
    this.loadDoctorsForBranch(branchId);
  }

  onDoctorSelect(): void {
    this.loadAvailableSlots();
  }

  setConsultationType(typeId: number): void {
    this.selectedConsultationType.set(typeId);
  }

  selectSlot(time: string): void {
    this.selectedSlot.set(time);
  }

  private loadDoctorsForBranch(branchId: string): void {
    if (!branchId) return;

    this.doctorService.getDoctorsByBranch(branchId).subscribe({
      next: (docs) => {
        this.doctors.set(docs || []);
        if (docs && docs.length > 0) {
          this.form.patchValue({ doctorId: docs[0].id });
          this.loadAvailableSlots();
        } else {
          this.availableSlots.set([]);
        }
      },
      error: () => this.availableSlots.set([])
    });
  }

  loadAvailableSlots(): void {
    const branchId = this.form.get('branchId')?.value;
    const doctorId = this.form.get('doctorId')?.value;
    const date = this.form.get('appointmentDate')?.value;

    if (!branchId || !doctorId || !date) {
      return;
    }

    this.loadingSlots.set(true);
    this.clinicService.getAvailableSlots(branchId, date, doctorId).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots || []);
        this.loadingSlots.set(false);

        // If previously selected slot is available, keep it; otherwise pick first available slot
        const firstAvailable = slots?.find(s => s.isAvailable);
        if (firstAvailable) {
          const currentValid = slots.find(s => s.time === this.selectedSlot() && s.isAvailable);
          if (!currentValid) {
            this.selectedSlot.set(firstAvailable.time);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching available slots:', err);
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const formVal = this.form.value;
    const selectedDocId = formVal.doctorId;
    const selectedDoc = this.doctors().find(d => d.id === selectedDocId);

    const resolvedDoctorBranchId = selectedDoc?.doctorBranchId ||
      (selectedDoc?.branches && selectedDoc.branches.length > 0 ? (selectedDoc.branches[0] as any).id : null) ||
      selectedDocId;

    const req = {
      patientId: formVal.patientId,
      branchId: formVal.branchId,
      doctorId: selectedDocId,
      doctorBranchId: resolvedDoctorBranchId,
      appointmentDate: formVal.appointmentDate,
      startTime: this.selectedSlot(),
      notes: formVal.notes,
      consultationType: this.selectedConsultationType()
    };

    this.clinicService.bookAppointment(req).subscribe({
      next: () => {
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'Failed to book appointment. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
