import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Register New Patient</h1>
        <p>Create a new patient file in the system</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/patients" class="btn btn-secondary">Cancel</a>
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
              <label>Full Name *</label>
              <input type="text" class="form-control" formControlName="fullName" placeholder="e.g. Ahmed Mahmoud" />
            </div>

            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" class="form-control" formControlName="dateOfBirth" />
            </div>

            <div class="form-group">
              <label>Gender *</label>
              <select class="form-control" formControlName="gender">
                <option [value]="0">Male</option>
                <option [value]="1">Female</option>
              </select>
            </div>

            <div class="form-group">
              <label>Primary Phone *</label>
              <input type="tel" class="form-control" formControlName="primaryPhone" placeholder="01012345678" />
            </div>

            <div class="form-group">
              <label>Secondary Phone (Optional)</label>
              <input type="tel" class="form-control" formControlName="secondaryPhone" placeholder="01112345678" />
            </div>

            <div class="form-group">
              <label>Blood Type (Optional)</label>
              <select class="form-control" formControlName="bloodType">
                <option [ngValue]="null">Select Blood Type</option>
                <option [value]="0">A+</option>
                <option [value]="1">A-</option>
                <option [value]="2">B+</option>
                <option [value]="3">B-</option>
                <option [value]="4">AB+</option>
                <option [value]="5">AB-</option>
                <option [value]="6">O+</option>
                <option [value]="7">O-</option>
              </select>
            </div>

            <div class="form-group" style="grid-column: span 2">
              <label>Address (Optional)</label>
              <input type="text" class="form-control" formControlName="address" placeholder="Zagazig, El-Sharkia" />
            </div>
          </div>

          <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px">
            <a routerLink="/patients" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
                Saving...
              } @else {
                Save & Register Patient
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PatientFormComponent {
  form: FormGroup;
  loading = signal(false);
  error   = signal('');

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['1990-01-01', Validators.required],
      gender: [0, Validators.required],
      primaryPhone: ['', Validators.required],
      secondaryPhone: [''],
      address: [''],
      bloodType: [null]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const req = {
      clinicId: this.auth.clinicId(),
      ...this.form.value,
      gender: Number(this.form.value.gender),
      bloodType: this.form.value.bloodType !== null ? Number(this.form.value.bloodType) : null
    };

    this.patientService.createPatient(req).subscribe({
      next: (patientId) => {
        this.router.navigate(['/patients', patientId]);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to create patient record.');
        this.loading.set(false);
      }
    });
  }
}
