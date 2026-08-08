import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly sidebarCollapsed = signal(true);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
