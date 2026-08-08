import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._currentUser());
  readonly clinicId    = computed(() => this._currentUser()?.clinicId ?? '');

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    // Restore user from storage on startup
    const stored = this.storage.getUser();
    if (stored && this.storage.getToken()) {
      this._currentUser.set(stored);
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, request).pipe(
      tap(res => {
        this.storage.setToken(res.token);
        this.storage.setUser(res.user);
        this._currentUser.set(res.user);
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/register`, request).pipe(
      tap(res => {
        this.storage.setToken(res.token);
        this.storage.setUser(res.user);
        this._currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
