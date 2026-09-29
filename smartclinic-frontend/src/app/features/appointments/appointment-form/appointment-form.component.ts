import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ClinicService } from '../../../core/services/clinic.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient } from '../../../core/models/patient.models';
import { Branch, Doctor } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Book New Appointment</h1>
        <p>Schedule a consultation appointment for a patient</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/appointments" class="btn btn-secondary">Cancel</a>
      </div>
    </div>

    <div class="card" style="max-width:760px">
      <div class="card__body">
        @if (error()) {
          <div class="alert alert-danger mb-4">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group" style="grid-column: span 2">
              <label>Select Patient *</label>
              <select class="form-control" formControlName="patientId">
                <option value="">-- Choose Patient --</option>
                @for (p of patients(); track p.id) {
                  <option [value]="p.id">{{ p.fullName }} ({{ p.medicalCode }})</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Branch *</label>
              <select class="form-control" formControlName="branchId" (change)="onBranchSelect($event)">
                <option value="">-- Select Branch --</option>
                @for (b of branches(); track b.id) {
                  <option [value]="b.id">{{ b.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Doctor *</label>
              <select class="form-control" formControlName="doctorId">
                <option value="">-- Select Doctor --</option>
                @for (d of doctors(); track d.id) {
                  <option [value]="d.id">
                    {{ d.fullName }} ({{ d.specializationName || d.title || 'Specialist' }})
                  </option>
                }
              </select>
              @if (doctors().length === 0) {
                <small class="text-danger mt-1 d-block">
                  No doctors found in clinic. <a routerLink="/doctors/new">Register a doctor here</a>.
                </small>
              }
            </div>

            <div class="form-group">
              <label>Appointment Date *</label>
              <input type="date" class="form-control" formControlName="appointmentDate" />
            </div>

            <div class="form-group">
              <label>Start Time (Optional)</label>
              <input type="time" class="form-control" formControlName="startTime" />
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label>Notes / Chief Complaint (Optional)</label>
              <textarea class="form-control" rows="2" formControlName="notes" placeholder="e.g. Follow-up consultation, severe headache"></textarea>
            </div>
          </div>

          <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px">
            <a routerLink="/appointments" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading() || form.invalid">
              @if (loading()) {
                <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
                Booking...
              } @else {
                Confirm Booking
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AppointmentFormComponent implements OnInit {
  form: FormGroup;
  patients = signal<Patient[]>([]);
  branches = signal<Branch[]>([]);
  doctors  = signal<Doctor[]>([]);
  loading  = signal(false);
  error    = signal('');

  private allClinicDoctors: Doctor[] = [];

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      branchId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: [today, Validators.required],
      startTime: ['10:00'],
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

    // Load all doctors in clinic immediately so doctor dropdown is ready
    this.doctorService.getDoctorsByClinic(cid).subscribe({
      next: (docs) => {
        this.allClinicDoctors = docs || [];
        this.doctors.set(this.allClinicDoctors);
      }
    });

    // Load branches
    this.doctorService.getBranchesByClinic(cid).subscribe({
      next: (res) => {
        this.branches.set(res || []);
        if (res && res.length > 0) {
          const defaultBranchId = res[0].id;
          this.form.patchValue({ branchId: defaultBranchId });
          this.filterDoctorsForBranch(defaultBranchId);
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
    this.filterDoctorsForBranch(branchId);
  }

  private filterDoctorsForBranch(branchId: string): void {
    if (!branchId) {
      this.doctors.set(this.allClinicDoctors);
      return;
    }

    this.doctorService.getDoctorsByBranch(branchId).subscribe({
      next: (branchDocs) => {
        if (branchDocs && branchDocs.length > 0) {
          this.doctors.set(branchDocs);
        } else {
          // If no specific branch assignment exists, fallback to all clinic doctors
          this.doctors.set(this.allClinicDoctors);
        }
      },
      error: () => this.doctors.set(this.allClinicDoctors)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const formVal = this.form.value;
    const selectedDocId = formVal.doctorId;
    const selectedDoc = this.doctors().find(d => d.id === selectedDocId);

    // Prefer DoctorBranchId if available on the doctor object, or fallback to selectedDocId
    const resolvedDoctorBranchId = selectedDoc?.doctorBranchId ||
      (selectedDoc?.branches && selectedDoc.branches.length > 0 ? (selectedDoc.branches[0] as any).id : null) ||
      selectedDocId;

    const req = {
      patientId: formVal.patientId,
      doctorBranchId: resolvedDoctorBranchId,
      appointmentDate: formVal.appointmentDate,
      startTime: formVal.startTime,
      notes: formVal.notes
    };

    this.clinicService.bookAppointment(req).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to book appointment. Please check doctor and date.');
        this.loading.set(false);
      }
    });
  }
}
