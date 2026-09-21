import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterPatientRequest, ActivateDoctorRequest, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._currentUser());
  readonly clinicId    = computed(() => this._currentUser()?.clinicId ?? '');

  readonly isAdmin = computed(() => {
    const role = this._currentUser()?.userType;
    return role === 'ClinicAdmin' || role === 'PlatformAdmin';
  });

  readonly isDoctor = computed(() => {
    return this._currentUser()?.userType === 'Doctor';
  });

  readonly isPatient = computed(() => {
    return this._currentUser()?.userType === 'Patient';
  });

  readonly isReceptionist = computed(() => {
    return this._currentUser()?.userType === 'Receptionist';
  });

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

  registerPatient(request: RegisterPatientRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/register-patient`, request).pipe(
      tap(res => {
        this.storage.setToken(res.token);
        this.storage.setUser(res.user);
        this._currentUser.set(res.user);
      })
    );
  }

  activateDoctor(request: ActivateDoctorRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/activate-doctor`, request).pipe(
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
