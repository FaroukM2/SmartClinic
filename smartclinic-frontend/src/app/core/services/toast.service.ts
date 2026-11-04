import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(type: ToastItem['type'], title: string, message?: string, duration = 4500) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now()
    };

    this.toasts.update(current => [newToast, ...current]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  success(title: string, message?: string, duration = 4000) {
    return this.show('success', title, message, duration);
  }

  error(title: string, message?: string, duration = 5500) {
    return this.show('error', title, message, duration);
  }

  info(title: string, message?: string, duration = 4000) {
    return this.show('info', title, message, duration);
  }

  warning(title: string, message?: string, duration = 4500) {
    return this.show('warning', title, message, duration);
  }

  dismiss(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}

