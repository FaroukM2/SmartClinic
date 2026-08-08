import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./features/patients/patients-list/patients-list.component').then(m => m.PatientsListComponent)
      },
      {
        path: 'patients/new',
        loadComponent: () => import('./features/patients/patient-form/patient-form.component').then(m => m.PatientFormComponent)
      },
      {
        path: 'patients/:id',
        loadComponent: () => import('./features/patients/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent)
      },
      {
        path: 'doctors',
        loadComponent: () => import('./features/doctors/doctors-list/doctors-list.component').then(m => m.DoctorsListComponent)
      },
      {
        path: 'doctors/new',
        loadComponent: () => import('./features/doctors/doctor-form/doctor-form.component').then(m => m.DoctorFormComponent)
      },
      {
        path: 'branches',
        loadComponent: () => import('./features/branches/branches-list/branches-list.component').then(m => m.BranchesListComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/appointments-list/appointments-list.component').then(m => m.AppointmentsListComponent)
      },
      {
        path: 'appointments/new',
        loadComponent: () => import('./features/appointments/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
      },
      {
        path: 'visits/:id',
        loadComponent: () => import('./features/visits/visit-detail/visit-detail.component').then(m => m.VisitDetailComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payments-list/payments-list.component').then(m => m.PaymentsListComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
