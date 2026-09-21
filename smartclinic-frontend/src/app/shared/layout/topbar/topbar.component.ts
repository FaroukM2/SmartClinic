import { Component, computed, inject, Input, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  template: `
    <header class="topbar" [class.sidebar-collapsed]="collapsed">
      <!-- Left: Clinic Branch & Search -->
      <div class="topbar__left">
        <!-- Clinic & Branch Pill -->
        <div class="clinic-badge">
          <div class="clinic-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="clinic-details">
            <span class="clinic-name">Smart Health Polyclinic</span>
            <span class="branch-name">Downtown Central Branch</span>
          </div>
        </div>

        <!-- Global Search Bar -->
        <div class="topbar-search">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search patients, medical records, appointments..."
            (keydown.enter)="onSearch($event)"
          />
          <kbd class="shortcut-chip">Ctrl K</kbd>
        </div>
      </div>

      <!-- Right: Live Status, Controls & Profile -->
      <div class="topbar__right">
        <!-- Live Sync Pill -->
        <div class="sync-status-pill">
          <span class="live-dot"></span>
          <span>Live Sync</span>
        </div>

        <!-- Theme Toggle -->
        <button class="icon-btn" (click)="toggleTheme()" [title]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          @if (isDark()) {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <!-- Notification Bell -->
        <button class="icon-btn notif-btn" title="System Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-badge">3</span>
        </button>

        <div class="topbar-divider"></div>

        <!-- User Profile Pill -->
        <div class="user-profile-pill">
          <div class="user-avatar-circle">{{ userInitial() }}</div>
          <div class="user-meta">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-badge" [class]="roleClass()">{{ userRole() }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() collapsed = false;
  isDark = signal(true);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly userName = computed(() => this.auth.currentUser()?.fullName ?? 'Administrator');
  readonly userRole = computed(() => this.auth.currentUser()?.userType ?? 'Admin');
  readonly userInitial = computed(() => (this.auth.currentUser()?.fullName?.[0] ?? 'A').toUpperCase());

  readonly roleClass = computed(() => {
    const role = this.auth.currentUser()?.userType;
    if (role === 'ClinicAdmin' || role === 'PlatformAdmin') return 'badge-admin';
    if (role === 'Doctor') return 'badge-doctor';
    if (role === 'Patient') return 'badge-patient';
    return 'badge-reception';
  });

  constructor() {
    document.documentElement.removeAttribute('data-theme');
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    if (this.isDark()) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value?.trim()) {
      this.router.navigate(['/patients'], { queryParams: { q: target.value.trim() } });
    }
  }
}
