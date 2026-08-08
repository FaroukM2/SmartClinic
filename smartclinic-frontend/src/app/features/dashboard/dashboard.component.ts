import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClinicService } from '../../core/services/clinic.service';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { DashboardStats } from '../../core/models/clinic.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ userName() }} — Here's what's happening today.</p>
      </div>
      <div class="page-header__actions">
        <button class="btn btn-secondary" (click)="loadRealStats()" title="Refresh Stats">
          🔄 Refresh Data
        </button>
        <a routerLink="/appointments/new" class="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Appointment
        </a>
      </div>
    </div>

    @if (loading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Connecting to clinic database...</span>
      </div>
    } @else if (stats()) {
      <!-- Stat Cards (Real Dynamic Database Counts) -->
      <div class="stats-grid mb-6">
        <div class="stat-card" style="--card-accent:#0d9488;--card-icon-bg:rgba(13,148,136,0.12)">
          <div class="stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Total Patients</div>
            <div class="stat-card__value">{{ stats()!.totalPatients | number }}</div>
            <div class="stat-card__change neutral">Registered in DB</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#3b82f6;--card-icon-bg:rgba(59,130,246,0.12)">
          <div class="stat-card__icon" style="color:#60a5fa">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Today's Appointments</div>
            <div class="stat-card__value">{{ stats()!.todayAppointmentsCount }}</div>
            <div class="stat-card__change neutral">Scheduled today</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#22c55e;--card-icon-bg:rgba(34,197,94,0.12)">
          <div class="stat-card__icon" style="color:#4ade80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Completed Visits</div>
            <div class="stat-card__value">{{ stats()!.completedVisitsToday }}</div>
            <div class="stat-card__change neutral">Today</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#f59e0b;--card-icon-bg:rgba(245,158,11,0.12)">
          <div class="stat-card__icon" style="color:#fbbf24">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Today's Revenue</div>
            <div class="stat-card__value">{{ stats()!.todayRevenue | currency:'EGP':'symbol':'1.0-0' }}</div>
            <div class="stat-card__change up">Real billing total</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#8b5cf6;--card-icon-bg:rgba(139,92,246,0.12)">
          <div class="stat-card__icon" style="color:#a78bfa">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Active Doctors</div>
            <div class="stat-card__value">{{ stats()!.activeDoctorsCount }}</div>
            <div class="stat-card__change neutral">Active staff</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#06b6d4;--card-icon-bg:rgba(6,182,212,0.12)">
          <div class="stat-card__icon" style="color:#22d3ee">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__label">Active Branches</div>
            <div class="stat-card__value">{{ stats()!.activeBranchesCount }}</div>
            <div class="stat-card__change neutral">Locations</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Overview Grid -->
      <div class="content-grid">
        <div class="card">
          <div class="card__header">
            <h3>Quick Actions</h3>
          </div>
          <div class="card__body">
            <div class="quick-actions">
              <a routerLink="/patients/new" class="quick-action">
                <div class="qa-icon" style="background:rgba(13,148,136,0.12);color:var(--primary-light)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                </div>
                <span>Register Patient</span>
              </a>
              <a routerLink="/appointments/new" class="quick-action">
                <div class="qa-icon" style="background:rgba(59,130,246,0.12);color:#60a5fa">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/></svg>
                </div>
                <span>Book Appointment</span>
              </a>
              <a routerLink="/doctors/new" class="quick-action">
                <div class="qa-icon" style="background:rgba(139,92,246,0.12);color:#a78bfa">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <span>Add Doctor</span>
              </a>
              <a routerLink="/patients" class="quick-action">
                <div class="qa-icon" style="background:rgba(245,158,11,0.12);color:#fbbf24">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <span>Search Patients</span>
              </a>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <h3>System Overview</h3>
          </div>
          <div class="card__body">
            <div class="overview-list">
              <div class="overview-item">
                <span class="text-muted fs-sm">Clinic Status</span>
                <span class="badge badge-success"><span class="dot"></span>Online</span>
              </div>
              <div class="overview-item">
                <span class="text-muted fs-sm">API Connection</span>
                <span class="badge badge-success"><span class="dot"></span>Connected to .NET 9</span>
              </div>
              <div class="overview-item">
                <span class="text-muted fs-sm">Today's Date</span>
                <span class="fs-sm fw-600">{{ today }}</span>
              </div>
              <div class="overview-item">
                <span class="text-muted fs-sm">Active Doctors</span>
                <span class="fs-sm fw-600">{{ stats()!.activeDoctorsCount }} Doctors</span>
              </div>
              <div class="overview-item">
                <span class="text-muted fs-sm">Active Branches</span>
                <span class="fs-sm fw-600">{{ stats()!.activeBranchesCount }} Branches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats   = signal<DashboardStats | null>(null);
  loading = signal(true);
  error   = signal('');
  userName = computed(() => this.auth.currentUser()?.fullName?.split(' ')[0] ?? 'Admin');
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  private readonly zeroStats: DashboardStats = {
    totalPatients: 0,
    todayAppointmentsCount: 0,
    completedVisitsToday: 0,
    todayRevenue: 0,
    activeDoctorsCount: 0,
    activeBranchesCount: 0
  };

  constructor(
    private clinicService: ClinicService,
    private auth: AuthService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.loadRealStats();
  }

  loadRealStats(): void {
    this.loading.set(true);

    const user = this.auth.currentUser() || this.storage.getUser();
    const clinicId = user?.clinicId;

    if (!clinicId) {
      this.stats.set(this.zeroStats);
      this.loading.set(false);
      return;
    }

    this.clinicService.getDashboardStats(clinicId).subscribe({
      next: (data: DashboardStats) => {
        this.stats.set(data || this.zeroStats);
        this.loading.set(false);
      },
      error: () => {
        this.stats.set(this.zeroStats);
        this.loading.set(false);
      }
    });
  }
}
