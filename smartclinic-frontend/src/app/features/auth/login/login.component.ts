import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <!-- Left: Enterprise Medical Showcase Hero -->
      <div class="auth-hero">
        <div class="hero-overlay"></div>
        <div class="hero-glow-1"></div>
        <div class="hero-glow-2"></div>

        <div class="hero-content">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            <span>Enterprise Multi-Tenant Healthcare Cloud</span>
          </div>

          <div class="hero-brand">
            <div class="brand-icon-box">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <h1 class="hero-title">SmartClinic</h1>
              <p class="hero-subtitle">Next-Generation Clinical OS</p>
            </div>
          </div>

          <h2 class="hero-headline">
            Intelligent Care Management for Modern Medical Facilities.
          </h2>

          <p class="hero-description">
            Unify clinic operations, real-time consultation queues, electronic medical records, and digital prescriptions across multiple branches in one unified platform.
          </p>

          <!-- Floating Feature Glass Cards -->
          <div class="hero-features">
            <div class="feature-card">
              <div class="feat-icon feat-icon-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h4>Live Patient Queue</h4>
                <p>Synchronized workflow between reception and doctor consultation.</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feat-icon feat-icon-emerald">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <h4>Electronic Medical Records</h4>
                <p>Digital prescriptions, allergy tracking, and clinical history.</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feat-icon feat-icon-indigo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h4>Zero-Trust Multi-Tenancy</h4>
                <p>Strict role isolation for Admins, Doctors, Patients & Reception.</p>
              </div>
            </div>
          </div>

          <div class="hero-footer-stats">
            <div class="stat-item">
              <span class="stat-num">99.9%</span>
              <span class="stat-lbl">High Availability</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">.NET 9</span>
              <span class="stat-lbl">Clean Architecture</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">Angular 19</span>
              <span class="stat-lbl">Signals Reactivity</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Premium Glassmorphic Form Card -->
      <div class="auth-form-panel">
        <div class="login-card animate-scale">

          <!-- Card Header -->
          <div class="login-header">
            <div class="login-header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <div>
              <h2>Sign in to SmartClinic</h2>
              <p>Select your account role or use instant demo credentials</p>
            </div>
          </div>

          <!-- Role Selector Segmented Bar -->
          <div class="role-segmented-box">
            <button
              type="button"
              class="role-tab"
              [class.active]="currentPreset === 'admin'"
              (click)="selectPreset('admin')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>Admin</span>
            </button>
            <button
              type="button"
              class="role-tab"
              [class.active]="currentPreset === 'doctor'"
              (click)="selectPreset('doctor')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>Doctor</span>
            </button>
            <button
              type="button"
              class="role-tab"
              [class.active]="currentPreset === 'patient'"
              (click)="selectPreset('patient')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Patient</span>
            </button>
            <button
              type="button"
              class="role-tab"
              [class.active]="currentPreset === 'reception'"
              (click)="selectPreset('reception')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span>Reception</span>
            </button>
          </div>

          <!-- Role Description Hint -->
          <div class="role-desc-chip">
            <span class="role-dot"></span>
            <span>{{ getRoleDescription() }}</span>
          </div>

          @if (error()) {
            <div class="alert alert-danger animate-fade">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ error() }}</span>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
            <!-- Email -->
            <div class="form-group">
              <label for="email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Address
              </label>
              <div class="input-container">
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  [class.error]="submitted && f['email'].errors"
                  formControlName="email"
                  placeholder="name@smartclinic.com"
                  autocomplete="email"
                />
              </div>
              @if (submitted && f['email'].errors) {
                <span class="form-error">Please enter a valid email address</span>
              }
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </label>
              <div class="input-container">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="form-control"
                  [class.error]="submitted && f['password'].errors"
                  formControlName="password"
                  placeholder="••••••••••••"
                  autocomplete="current-password"
                />
                <button type="button" class="eye-toggle" (click)="toggleShowPassword()" tabindex="-1">
                  @if (showPassword()) {
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              @if (submitted && f['password'].errors) {
                <span class="form-error">Password is required</span>
              }
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-submit"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span class="spinner-sm"></span>
                <span>Authenticating...</span>
              } @else {
                <span>Sign In to Console</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              }
            </button>
          </form>

          <!-- Register / Activation Prompt -->
          <div class="register-prompt-box">
            <span>New patient or doctor needing password?</span>
            <a routerLink="/register" class="link-glow">
              Register or Activate Account →
            </a>
          </div>

          <!-- Trust & Security Footer -->
          <div class="login-card-footer">
            <div class="security-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>256-Bit SSL Encrypted Healthcare Session</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  submitted = false;
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);
  currentPreset = 'admin';

  private presets: Record<string, { email: string; pass: string }> = {
    admin: { email: 'admin@smartclinic.com', pass: 'Admin@123' },
    doctor: { email: 'doctor@smartclinic.com', pass: 'Doctor@123' },
    patient: { email: 'patient@smartclinic.com', pass: 'Patient@123' },
    reception: { email: 'receptionist@smartclinic.com', pass: 'Reception@123' }
  };

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [this.presets['admin'].email, [Validators.required, Validators.email]],
      password: [this.presets['admin'].pass, Validators.required]
    });
  }

  get f() { return this.form.controls; }

  selectPreset(preset: string) {
    this.currentPreset = preset;
    const creds = this.presets[preset];
    if (creds) {
      this.form.patchValue({ email: creds.email, password: creds.pass });
      this.error.set('');
    }
  }

  getRoleDescription(): string {
    switch (this.currentPreset) {
      case 'admin':
        return 'Administrator: Full control over doctors, branches, clinics, and revenue logs.';
      case 'doctor':
        return 'Doctor Workspace: Live consultation queue, start visit, and digital prescriptions.';
      case 'patient':
        return 'Patient Portal: Book appointments, view upcoming visits, and access prescriptions.';
      case 'reception':
        return 'Reception Desk: Register new patients, manage waiting lobby, and collect billing.';
      default:
        return '';
    }
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error.set('');
    if (this.form.invalid) return;

    this.loading.set(true);
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Invalid email or password. Please verify credentials.');
        this.loading.set(false);
      }
    });
  }
}
