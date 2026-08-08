import { Injectable } from '@angular/core';

const TOKEN_KEY = 'sc_token';
const USER_KEY  = 'sc_user';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t || t === 'undefined' || t === 'null') return null;
    return t;
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setUser(user: any): void {
    if (!user) {
      localStorage.removeItem(USER_KEY);
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const u = localStorage.getItem(USER_KEY);
    if (!u || u === 'undefined' || u === 'null') return null;
    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
