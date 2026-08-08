import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="bg-grid"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>

      <div class="login-card animate-scale">
        <div class="login-logo">
          <div class="logo-icon-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 class="login-brand">SmartClinic</h1>
            <p class="login-tagline">Medical Management System</p>
          </div>
        </div>

        <div class="login-body">
          <h2>Welcome back</h2>
          <p class="text-muted fs-sm mb-4" style="margin-top:4px">Sign in to your clinic account</p>

          @if (error()) {
            <div class="alert alert-danger animate-fade" style="margin-bottom:16px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group" style="margin-bottom:16px">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                class="form-control"
                [class.error]="submitted && f['email'].errors"
                formControlName="email"
                placeholder="admin@smartclinic.com"
                autocomplete="email"
              />
              @if (submitted && f['email'].errors) {
                <span class="form-error">Valid email is required</span>
              }
            </div>

            <div class="form-group" style="margin-bottom:24px">
              <label for="password">Password</label>
              <div class="input-with-action">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="form-control"
                  [class.error]="submitted && f['password'].errors"
                  formControlName="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button type="button" class="eye-btn" (click)="toggleShowPassword()" tabindex="-1">
                  @if (showPassword()) {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              @if (submitted && f['password'].errors) {
                <span class="form-error">Password is required</span>
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
                Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <p class="login-footer">
            SmartClinic &copy; 2026 — All rights reserved
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  submitted  = false;
  loading    = signal(false);
  error      = signal('');
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['admin@smartclinic.com', [Validators.required, Validators.email]],
      password: ['Admin@123', Validators.required]
    });
  }

  get f() { return this.form.controls; }

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
        this.error.set(err?.error?.message ?? 'Invalid email or password. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
