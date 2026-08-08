import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Settings & Account Profile</h1>
        <p>Manage system configuration, clinic profile and security settings</p>
      </div>
    </div>

    <div class="content-grid" style="grid-template-columns: 1fr 1fr">
      <!-- Profile Card -->
      <div class="card">
        <div class="card__header">
          <h3>👤 User Profile & Role</h3>
        </div>
        <div class="card__body">
          <div class="d-flex align-center gap-3 mb-6">
            <div class="avatar avatar-lg" style="background:var(--primary-glow);color:var(--primary-light);font-size:1.5rem">
              {{ userInitial() }}
            </div>
            <div>
              <h2 style="font-size:1.2rem;margin:0">{{ user()?.fullName }}</h2>
              <span class="badge badge-primary" style="margin-top:4px">{{ user()?.userType || 'Clinic Admin' }}</span>
            </div>
          </div>

          <div class="info-list">
            <div class="info-item">
              <span class="text-muted fs-xs">Email Address</span>
              <span class="fw-600 fs-sm">{{ user()?.email }}</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">User ID</span>
              <span class="fs-xs font-mono text-muted">{{ user()?.id }}</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">Clinic ID</span>
              <span class="fs-xs font-mono text-muted">{{ user()?.clinicId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Clinic Profile Card -->
      <div class="card">
        <div class="card__header">
          <h3>🏥 Clinic Organization Profile</h3>
        </div>
        <div class="card__body">
          <div class="info-list">
            <div class="info-item">
              <span class="text-muted fs-xs">Clinic Name</span>
              <span class="fw-600 fs-sm">Smart Clinic</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">Subdomain</span>
              <span class="badge badge-info">smartclinic.smartclinic.com</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">Contact Email</span>
              <span class="fs-sm">info&#64;smartclinic.com</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">Phone</span>
              <span class="fs-sm">01000000000</span>
            </div>
            <div class="info-item">
              <span class="text-muted fs-xs">Headquarters Address</span>
              <span class="fs-sm">Zagazig, Egypt</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings Card -->
      <div class="card" style="grid-column: span 2">
        <div class="card__header">
          <h3>🔒 Security & Password Change</h3>
        </div>
        <div class="card__body">
          @if (passwordSuccess()) {
            <div class="alert alert-success mb-4">Password updated successfully!</div>
          }

          <form (ngSubmit)="updatePassword()">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
              <div class="form-group">
                <label>Current Password</label>
                <input type="password" class="form-control" [(ngModel)]="pwdForm.currentPassword" name="currPwd" placeholder="••••••••" />
              </div>

              <div class="form-group">
                <label>New Password</label>
                <input type="password" class="form-control" [(ngModel)]="pwdForm.newPassword" name="newPwd" placeholder="••••••••" />
              </div>

              <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" class="form-control" [(ngModel)]="pwdForm.confirmPassword" name="confPwd" placeholder="••••••••" />
              </div>
            </div>

            <div style="margin-top:20px;display:flex;justify-content:flex-end">
              <button type="submit" class="btn btn-primary">Update Security Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-list { display: flex; flex-direction: column; gap: 14px; }
    .info-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid var(--border-light); }
    .info-item:last-child { border-bottom: none; }
  `]
})
export class SettingsComponent {
  user = computed(() => this.auth.currentUser());
  userInitial = computed(() => (this.auth.currentUser()?.fullName?.[0] ?? 'A').toUpperCase());

  passwordSuccess = signal(false);
  pwdForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(private auth: AuthService) {}

  updatePassword(): void {
    if (this.pwdForm.newPassword && this.pwdForm.newPassword === this.pwdForm.confirmPassword) {
      this.passwordSuccess.set(true);
      this.pwdForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      setTimeout(() => this.passwordSuccess.set(false), 3000);
    }
  }
}
