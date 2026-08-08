import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content" [class.sidebar-collapsed]="collapsed()">
        <app-topbar [collapsed]="collapsed()" />
        <main class="page-container">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  private ui = inject(UiService);
  readonly collapsed = this.ui.sidebarCollapsed;
}
