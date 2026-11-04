import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastItem } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card toast-{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              }
              @case ('error') {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('warning') {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              }
              @default {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>

          <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="toast-msg">{{ toast.message }}</p>
            }
          </div>

          <button class="toast-close" (click)="dismiss($event, toast.id)" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 18px;
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transform-origin: top right;
      animation: toastSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 35px -5px rgba(0, 0, 0, 0.6);
      }
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 1px;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 2px 0;
      line-height: 1.35;
      font-family: inherit;
    }

    .toast-msg {
      font-size: 0.8125rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.4;
      word-break: break-word;
    }

    .toast-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      margin-top: -2px;
      margin-right: -4px;

      &:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.08);
      }
    }

    // Semantic Variants
    .toast-success {
      border-left: 3px solid #10b981;
      .toast-icon {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }

    .toast-error {
      border-left: 3px solid #ef4444;
      .toast-icon {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }
    }

    .toast-warning {
      border-left: 3px solid #f59e0b;
      .toast-icon {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
      }
    }

    .toast-info {
      border-left: 3px solid #0ea5e9;
      .toast-icon {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
      }
    }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  dismiss(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.toastService.dismiss(id);
  }
}

