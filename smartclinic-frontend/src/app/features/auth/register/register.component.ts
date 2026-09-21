import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="bg-grid"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>

      <div class="register-card animate-scale">
        <div class="register-logo">
          <div class="logo-icon-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 class="register-brand">SmartClinic</h1>
            <p class="register-tagline">Healthcare Onboarding Portal</p>
          </div>
        </div>

        <div class="register-body">
          <!-- Role Tab Switcher -->
          <div class="tabs-header">
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'patient'"
              (click)="switchTab('patient')"
            >
              🧑‍💼 Patient Registration
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'doctor'"
              (click)="switchTab('doctor')"
            >
              👨‍⚕️ Doctor Activation
            </button>
          </div>

          @if (error()) {
            <div class="alert alert-danger animate-fade" style="margin-bottom:16px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error() }}
            </div>
          }

          <!-- TAB 1: PATIENT REGISTRATION -->
          @if (activeTab() === 'patient') {
            <div class="tab-content animate-fade">
              <div class="tab-hint">
                <span class="badge badge-primary">Patient Account</span>
                <p class="text-muted fs-xs" style="margin:4px 0 12px">Register to book medical appointments and review your prescriptions.</p>
              </div>

              <form [formGroup]="patientForm" (ngSubmit)="onPatientSubmit()">
                <div class="form-grid">
                  <div class="form-group" style="grid-column: span 2">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      formControlName="fullName"
                      placeholder="e.g. Mahmoud Ali"
                    />
                    @if (submittedPatient && pf['fullName'].errors) {
                      <span class="form-error">Full name is required</span>
                    }
                  </div>

                  <div class="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      class="form-control"
                      formControlName="email"
                      placeholder="mahmoud@gmail.com"
                    />
                    @if (submittedPatient && pf['email'].errors) {
                      <span class="form-error">Valid email is required</span>
                    }
                  </div>

                  <div class="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      class="form-control"
                      formControlName="phoneNumber"
                      placeholder="01012345678"
                    />
                    @if (submittedPatient && pf['phoneNumber'].errors) {
                      <span class="form-error">Phone is required</span>
                    }
                  </div>

                  <div class="form-group">
                    <label>Gender *</label>
                    <select class="form-control" formControlName="gender">
                      <option [value]="1">Male</option>
                      <option [value]="2">Female</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      class="form-control"
                      formControlName="dateOfBirth"
                    />
                    @if (submittedPatient && pf['dateOfBirth'].errors) {
                      <span class="form-error">Date of birth is required</span>
                    }
                  </div>

                  <div class="form-group" style="grid-column: span 2">
                    <label>Password *</label>
                    <input
                      type="password"
                      class="form-control"
                      formControlName="password"
                      placeholder="••••••••"
                    />
                    @if (submittedPatient && pf['password'].errors) {
                      <span class="form-error">Password (min 6 chars) is required</span>
                    }
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  style="width:100%; justify-content:center; margin-top:16px"
                  [disabled]="loading()"
                >
                  @if (loading()) {
                    <span class="spinner" style="width:18px;height:18px;border-width:2px"></span>
                    Creating Account...
                  } @else {
                    Register Patient Account
                  }
                </button>
              </form>
            </div>
          }

          <!-- TAB 2: DOCTOR ACTIVATION -->
          @if (activeTab() === 'doctor') {
            <div class="tab-content animate-fade">
              <div class="tab-hint doctor-hint">
                <span class="badge badge-warning">Invited Doctors Only</span>
                <p class="text-muted fs-xs" style="margin:4px 0 12px">
                  If the Clinic Admin already added your email to the clinic staff, set your password here to activate your doctor profile.
                </p>
              </div>

              <form [formGroup]="doctorForm" (ngSubmit)="onDoctorSubmit()">
                <div class="form-group" style="margin-bottom:14px">
                  <label>Registered Email Address *</label>
                  <input
                    type="email"
                    class="form-control"
                    formControlName="email"
                    placeholder="doctor@smartclinic.com"
                  />
                  @if (submittedDoctor && df['email'].errors) {
                    <span class="form-error">Email provided to clinic admin is required</span>
                  }
                </div>

                <div class="form-group" style="margin-bottom:14px">
                  <label>Create Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    formControlName="password"
                    placeholder="••••••••"
                  />
                  @if (submittedDoctor && df['password'].errors) {
                    <span class="form-error">Password is required</span>
                  }
                </div>

                <div class="form-group" style="margin-bottom:18px">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    formControlName="confirmPassword"
                    placeholder="••••••••"
                  />
                  @if (submittedDoctor && doctorForm.hasError('mismatch')) {
                    <span class="form-error">Passwords do not match</span>
                  }
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  style="width:100%; justify-content:center"
                  [disabled]="loading()"
                >
                  @if (loading()) {
                    <span class="spinner" style="width:18px;height:18px;border-width:2px"></span>
                    Activating Profile...
                  } @else {
                    Activate Doctor Account
                  }
                </button>
              </form>
            </div>
          }

          <div class="login-footer-row">
            <span>Already have an active account?</span>
            <a routerLink="/login" class="link-primary">Sign in here</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  activeTab = signal<'patient' | 'doctor'>('patient');
  loading   = signal(false);
  error     = signal('');

  patientForm: FormGroup;
  doctorForm: FormGroup;

  submittedPatient = false;
  submittedDoctor = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: [1, Validators.required],
      dateOfBirth: ['1998-05-15', Validators.required],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.doctorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get pf() { return this.patientForm.controls; }
  get df() { return this.doctorForm.controls; }

  switchTab(tab: 'patient' | 'doctor') {
    this.activeTab.set(tab);
    this.error.set('');
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onPatientSubmit() {
    this.submittedPatient = true;
    this.error.set('');
    if (this.patientForm.invalid) return;

    this.loading.set(true);
    const val = this.patientForm.value;
    const req = {
      clinicId: this.auth.clinicId() || '00000000-0000-0000-0000-000000000000',
      fullName: val.fullName,
      email: val.email,
      phoneNumber: val.phoneNumber,
      gender: Number(val.gender),
      dateOfBirth: val.dateOfBirth,
      address: val.address,
      password: val.password
    };

    this.auth.registerPatient(req).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to register patient account.');
        this.loading.set(false);
      }
    });
  }

  onDoctorSubmit() {
    this.submittedDoctor = true;
    this.error.set('');
    if (this.doctorForm.invalid) return;

    this.loading.set(true);
    const val = this.doctorForm.value;
    this.auth.activateDoctor({ email: val.email, password: val.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'This email is not registered by the clinic administration. Please contact your manager.');
        this.loading.set(false);
      }
    });
  }
}
