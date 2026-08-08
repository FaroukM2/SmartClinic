import { Component, inject, Input, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  template: `
    <header class="topbar" [class.sidebar-collapsed]="collapsed">
      <div class="topbar__left">
        <h1 class="page-title">SmartClinic Portal</h1>
      </div>

      <div class="topbar__right">
        <!-- Theme Toggle -->
        <button class="icon-btn" (click)="toggleTheme()" [title]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          @if (isDark()) {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <!-- Notifications -->
        <button class="icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-dot"></span>
        </button>
      </div>
    </header>
  `,
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() collapsed = false;
  isDark = signal(true);
  private auth = inject(AuthService);

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
}
