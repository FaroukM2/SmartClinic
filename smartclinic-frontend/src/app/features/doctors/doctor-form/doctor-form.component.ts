import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Specialization } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Register New Doctor</h1>
        <p>Add a new specialist to your medical staff</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/doctors" class="btn btn-secondary">Cancel</a>
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
              <input type="text" class="form-control" formControlName="fullName" placeholder="Dr. Khaled Omar" />
            </div>

            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" class="form-control" formControlName="email" placeholder="khaled@smartclinic.com" />
            </div>

            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" class="form-control" formControlName="phoneNumber" placeholder="01099887766" />
            </div>

            <div class="form-group">
              <label>Specialization *</label>
              <select class="form-control" formControlName="specializationId">
                <option value="">Select Specialization</option>
                @for (spec of specs(); track spec.id) {
                  <option [value]="spec.id">{{ spec.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Professional Title</label>
              <input type="text" class="form-control" formControlName="title" placeholder="Consultant Cardiologist" />
            </div>

            <div class="form-group">
              <label>Medical License Number</label>
              <input type="text" class="form-control" formControlName="licenseNumber" placeholder="LIC-998877" />
            </div>

            <div class="form-group">
              <label>Default Consultation Fee (EGP)</label>
              <input type="number" class="form-control" formControlName="consultationFee" placeholder="350" />
            </div>
          </div>

          <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px">
            <a routerLink="/doctors" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
                Saving...
              } @else {
                Save Doctor Profile
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DoctorFormComponent implements OnInit {
  form: FormGroup;
  specs = signal<Specialization[]>([]);
  loading = signal(false);
  error   = signal('');

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specializationId: ['', Validators.required],
      title: ['Consultant Specialist'],
      licenseNumber: ['LIC-2026-MED'],
      consultationFee: [300, Validators.required]
    });
  }

  ngOnInit(): void {
    const clinicId = this.auth.clinicId();
    if (clinicId) {
      this.doctorService.getSpecializationsByClinic(clinicId).subscribe({
        next: (res) => this.specs.set(res),
        error: () => this.specs.set([])
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const req = {
      clinicId: this.auth.clinicId(),
      ...this.form.value
    };

    this.doctorService.createDoctor(req).subscribe({
      next: () => this.router.navigate(['/doctors']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to register doctor.');
        this.loading.set(false);
      }
    });
  }
}
