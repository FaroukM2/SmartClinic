import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.expanded]="!collapsed()">

      <!-- ── Logo ───────────────────────────────────── -->
      <div class="sidebar__logo">
        <div class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="logo-text">
          <span class="logo-name">SmartClinic</span>
          <span class="logo-sub">Medical System</span>
        </span>
      </div>

      <!-- ── Nav ────────────────────────────────────── -->
      <nav class="sidebar__nav">

        <span class="nav-group">Main</span>

        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Dashboard">
          <svg class="ni" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span class="nav-label">Dashboard</span>
        </a>

        <a routerLink="/appointments" routerLinkActive="active" class="nav-item" title="Appointments">
          <svg class="ni" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          <span class="nav-label">Appointments</span>
        </a>

        <a routerLink="/patients" routerLinkActive="active" class="nav-item" title="Patients">
          <svg class="ni" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
          <span class="nav-label">Patients</span>
        </a>

        <a routerLink="/payments" routerLinkActive="active" class="nav-item" title="Payments">
          <svg class="ni" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="nav-label">Payments</span>
        </a>

        <span class="nav-group" style="margin-top:8px">Management</span>

        <a routerLink="/doctors" routerLinkActive="active" class="nav-item" title="Doctors">
          <svg class="ni" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span class="nav-label">Doctors</span>
        </a>

        <a routerLink="/branches" routerLinkActive="active" class="nav-item" title="Branches">
          <svg class="ni" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="nav-label">Branches</span>
        </a>

        <a routerLink="/settings" routerLinkActive="active" class="nav-item" title="Settings">
          <svg class="ni" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="nav-label">Settings</span>
        </a>

      </nav>

      <!-- ── Toggle button (between nav and footer) ── -->
      <button class="collapse-toggle" (click)="toggleCollapse()"
              [title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          @if (collapsed()) {
            <polyline points="13 17 18 12 13 7"/>
            <polyline points="6 17 11 12 6 7"/>
          } @else {
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          }
        </svg>
      </button>

      <!-- ── Footer ─────────────────────────────────── -->
      <div class="sidebar__footer">
        <div class="avatar">{{ userInitial() }}</div>
        <span class="footer-text">
          <span class="u-name">{{ userName() }}</span>
          <span class="u-role">{{ userRole() }}</span>
        </span>
        <button class="logout-btn" (click)="logout()" title="Logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

    </aside>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private ui = inject(UiService);
  private auth = inject(AuthService);

  readonly collapsed = this.ui.sidebarCollapsed;

  readonly userName = computed(() => this.auth.currentUser()?.fullName ?? 'Admin');
  readonly userRole = computed(() => this.auth.currentUser()?.userType ?? 'ClinicAdmin');
  readonly userInitial = computed(() => (this.auth.currentUser()?.fullName?.[0] ?? 'A').toUpperCase());

  toggleCollapse() { this.ui.toggleSidebar(); }
  logout() { this.auth.logout(); }
}
