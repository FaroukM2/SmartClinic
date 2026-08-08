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
              <select class="form-control" (change)="onBranchSelect($event)">
                <option value="">-- Select Branch --</option>
                @for (b of branches(); track b.id) {
                  <option [value]="b.id">{{ b.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Doctor *</label>
              <select class="form-control" (change)="onDoctorSelect($event)">
                <option value="">-- Select Doctor --</option>
                @for (d of doctors(); track d.id) {
                  <option [value]="d.id">{{ d.fullName }} ({{ d.specializationName || 'Specialist' }})</option>
                }
              </select>
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
            <button type="submit" class="btn btn-primary" [disabled]="loading()">
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

  selectedBranchId = '';
  selectedDoctorId = '';

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
      appointmentDate: [today, Validators.required],
      startTime: ['10:00'],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const cid = this.auth.clinicId();
    if (!cid) return;

    this.patientService.searchPatients(cid).subscribe({
      next: (res) => this.patients.set(res)
    });

    this.doctorService.getBranchesByClinic(cid).subscribe({
      next: (res) => this.branches.set(res)
    });

    const presetPatientId = this.route.snapshot.queryParams['patientId'];
    if (presetPatientId) {
      this.form.patchValue({ patientId: presetPatientId });
    }
  }

  onBranchSelect(event: any): void {
    this.selectedBranchId = event.target.value;
    if (this.selectedBranchId) {
      this.doctorService.getDoctorsByBranch(this.selectedBranchId).subscribe({
        next: (docs) => this.doctors.set(docs)
      });
    }
  }

  onDoctorSelect(event: any): void {
    this.selectedDoctorId = event.target.value;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const req = {
      patientId: this.form.value.patientId,
      doctorBranchId: this.selectedDoctorId || '00000000-0000-0000-0000-000000000000',
      appointmentDate: this.form.value.appointmentDate,
      startTime: this.form.value.startTime,
      notes: this.form.value.notes
    };

    this.clinicService.bookAppointment(req).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to book appointment.');
        this.loading.set(false);
      }
    });
  }
}
