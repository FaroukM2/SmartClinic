# 🎨 SmartClinic Angular 19 Frontend Documentation

## 📌 Overview
This document details the complete frontend single-page application (SPA) built for the **SmartClinic Medical Management System**.

The application is built with **Angular 19** utilizing modern **standalone components**, **reactive signals**, a custom dark/light theme SCSS design system, and full RESTful integration with the **.NET 9** backend API.

---

## 🚀 Tech Stack & Core Libraries

- **Framework:** Angular 19 (Standalone Components, Signals, Functional Guards & Interceptors)
- **Styling & Design System:** Pure SCSS (Custom Design Tokens, Responsive Grids, Glassmorphism, Micro-animations)
- **State & Signals:** Angular `signal()` and `computed()` for reactive state management
- **Forms:** Angular Reactive Forms with real-time validation
- **HTTP Client:** Angular `provideHttpClient` with functional `authInterceptor` for automatic JWT Bearer token attachment
- **Routing:** Angular Router with lazy-loaded feature components protected by `authGuard`
- **Charts & Data:** Chart.js integration ready

---

## 📁 Application Architecture

```text
smartclinic-frontend/src/app/
├── core/
│   ├── models/
│   │   ├── appointment.models.ts     # Appointment DTOs & status mappings
│   │   ├── auth.models.ts            # Login/Register DTOs & User types
│   │   ├── clinic.models.ts          # Visit, Prescription, Payment, Dashboard DTOs
│   │   ├── doctor.models.ts          # Doctor, Branch, Specialization DTOs
│   │   └── patient.models.ts         # Patient DTOs & blood type/gender labels
│   ├── services/
│   │   ├── auth.service.ts           # Login/Logout & Signals state
│   │   ├── clinic.service.ts         # Dashboard, Appointments, Visits, Prescriptions, Payments
│   │   ├── doctor.service.ts         # Doctors, Branches, Specializations API
│   │   ├── patient.service.ts        # Patient Search, Registration & EMR API
│   │   └── storage.service.ts        # JWT & User LocalStorage manager
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Functional HTTP Bearer Token interceptor
│   └── guards/
│       └── auth.guard.ts             # Route activation guard
├── shared/
│   └── layout/
│       ├── layout.component.ts       # Shell layout container
│       ├── sidebar/                  # Collapsible navigation sidebar
│       └── topbar/                   # Header with dark/light mode toggle
└── features/
    ├── auth/
    │   └── login/                    # Sleek glassmorphic login screen
    ├── dashboard/                    # Clinic metrics cards & quick action grid
    ├── patients/
    │   ├── patients-list/            # Searchable patient directory
    │   ├── patient-form/             # Patient registration form
    │   └── patient-detail/           # Patient profile & EMR medical history
    ├── doctors/
    │   ├── doctors-list/             # Branch-filtered doctor staff cards
    │   └── doctor-form/              # Doctor registration form
    ├── branches/
    │   └── branches-list/            # Branch & Specialization manager modal
    ├── appointments/
    │   ├── appointments-list/        # Daily queue & schedule manager
    │   └── appointment-form/         # Appointment booking wizard
    ├── visits/
    │   └── visit-detail/             # Clinical diagnosis, e-Rx & payment process
    └── payments/
        └── payments-list/            # Financial receipts ledger
```

---

## 🔑 Key Features & Pages

### 1. Authentication & Security (`/login`)
- Glassmorphism design card with animated background grid and glow effects.
- Automatic password mask toggle.
- JWT storage in LocalStorage with auto-injection on every outgoing HTTP request.

### 2. Analytical Dashboard (`/dashboard`)
- Metric stat cards for:
  - Total Patients
  - Today's Appointments Count
  - Completed Visits Today
  - Today's Revenue (EGP)
  - Active Doctors Count
  - Active Branches Count
- Quick-action shortcuts for fast navigation.

### 3. Patient Directory & EMR (`/patients`)
- Searchable patient directory by name, phone, or medical code (`P-yyyyMMdd-XXXX`).
- Comprehensive Electronic Medical Record (EMR) screen for allergies, chronic diseases, previous surgeries, and current medications.

### 4. Doctors & Branches Management (`/doctors`, `/branches`)
- Filter doctors by assigned branch.
- Modal interface to add new medical specializations and clinic branch locations.

### 5. Appointments & Daily Queue (`/appointments`)
- Real-time daily queue tracking (`#1`, `#2`, ...).
- Action buttons to start consultation visits.

### 6. Clinical Examination & e-Prescription (`/visits/:id`)
- Clinical examination note recorder (Chief complaint, diagnosis, treatment plan).
- Dynamic Electronic Prescription (e-Rx) item adder.
- Payment process & receipt generation (`REC-yyyyMMdd-XXXX`).

---

## 🏃 Running the Application

### 1. Start Backend API
```powershell
dotnet run --project "f:\Instant\Graduation Project_withAntigravity\SmartClinic.API\SmartClinic.API.csproj" --launch-profile http
```
- **API Base URL:** `http://localhost:5239/api`
- **Swagger UI:** `http://localhost:5239/swagger`

### 2. Start Angular Frontend
```powershell
cd "f:\Instant\Graduation Project_withAntigravity\smartclinic-frontend"
npx -y @angular/cli@19 serve --port 4200
```
- **Frontend App:** `http://localhost:4200`
- **Default Credentials:**
  - Email: `admin@smartclinic.com`
  - Password: `Admin@123`
