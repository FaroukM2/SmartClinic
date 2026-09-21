# 🏥 SmartClinic - Enterprise Clinic Management System

## 🌟 1. Project Concept & Vision
**SmartClinic** is an enterprise-grade, multi-tenant Clinic Management System (CMS) designed with modern software engineering principles, **Clean Architecture**, and **Domain-Driven Design (DDD)** on **.NET 9**.

The system is designed to streamline administrative, operational, and clinical workflows for healthcare organizations operating single or multi-branch clinics. It covers the full lifecycle of medical service delivery: from patient onboarding, appointment scheduling, daily queue management, clinical consultation, electronic medical records (EMR), prescription writing, to payment processing and financial auditing.

---

## 🚀 2. System Architecture & Tech Stack

### Technology Stack
- **Framework**: .NET 9 (`net9.0`) & C# 13
- **Architecture**: Clean Architecture (Onion Architecture)
- **Design Patterns**: CQRS (Command Query Responsibility Segregation) with **MediatR**
- **Data Access**: Entity Framework Core 9 (Code-First) & SQL Server
- **Validation**: FluentValidation
- **Object Mapping**: AutoMapper
- **Security**: JWT (JSON Web Tokens) Bearer Authentication & PBKDF2/HMACSHA256 Password Hashing

### Solution Architecture Layers
```text
SmartClinic Infrastructure & Presentation Solution:

SmartClinic.API (Presentation Layer)
  ├── Controllers (REST API Endpoints)
  └── Middlewares (Error Handling, Auth, Versioning)
        │
        ▼
SmartClinic.Infrastructure (External Services)
  ├── Authentication (JWT Generator, Password Hasher)
  └── File Storage & Email Services
        │
        ▼
SmartClinic.Application (Business Logic)
  ├── Features (CQRS Commands, Handlers, Queries, DTOs)
  ├── Behaviors (Validation, Logging Pipelines)
  └── Interfaces (Persistence & Service Abstractions)
        │
        ▼
SmartClinic.Persistence (Data Access)
  ├── Context (SmartClinicDbContext)
  ├── Configurations (EF Core Entity Mappings)
  └── Repositories (Repository Pattern & Unit of Work)
        │
        ▼
SmartClinic.Domain (Core Domain)
  ├── Entities (Domain Models)
  ├── Enums (Domain Value Mappings)
  └── Common (Auditable & Base Entity Contracts)
```

---

## 💼 3. Implemented Modules & Services

### Phase 0: Authentication & Security
- **Multi-Tenant User Accounts**: Secure user accounts linked to specific clinics.
- **JWT & Refresh Token Flow**: Access token generation with role claims and 7-day refresh token rotation.
- **Role-Based Access Control (RBAC)**: Fine-grained authorization per user type (Admin, Doctor, Receptionist).

### Phase 1: Core Hierarchy (Clinics, Branches, Specializations & Doctors)
- **Branch Management**: Support for multi-branch clinics with independent contact and location settings.
- **Medical Specializations**: Cataloging medical specialties per clinic.
- **Doctor Profiles & Branch Allocation**: Doctors assigned to specific branches with customizable:
  - Consultation Fee & Follow-Up Fee.
  - Follow-up valid day limits.
  - Time slot duration in minutes (`SlotDurationMinutes`).
- **Doctor Schedules**: Weekly working schedules (`DayOfWeek`, `StartTime`, `EndTime`, `MaxPatients`).

### Phase 2: Patient Management & EMR
- **Automated Medical Code Generation**: Auto-assigns unique human-readable medical codes (e.g. `P-20260807-4821`).
- **Patient Directory & Search**: Comprehensive search filtering by Name, Phone Number, or Medical Code.
- **Electronic Medical Records (EMR)**: Chronic diseases, allergies, surgical history, and physician notes.
- **Medical Attachments**: Storage and indexing of lab results, X-rays, and reports.

### Phase 3: Appointments & Visit Management
- **Daily Queue Management**: Auto-calculates `QueueNumber` per doctor per branch per day.
- **Appointment Lifecycle**: Transition tracking (`Reserved` ➔ `Waiting` ➔ `InConsultation` ➔ `Completed` / `Cancelled` / `NoShow`).
- **Clinical Consultation Visits**: Electronic exam forms capturing chief complaints, physical exam notes, diagnosis, and physician remarks.

### Phase 4: Prescriptions & Billing
- **Electronic Prescriptions (e-Rx)**: Structured medicine items with exact Dosage, Frequency, Duration, and Instructions.
- **Payment Processing & Invoicing**: Automatic net amount calculation (`Amount - Discount`), receipt generation (`REC-yyyyMMdd-XXXX`), and payment tracking (Cash, Credit Card, Insurance).

---

## 📊 4. Database Schema Summary

| Entity | Purpose | Key Relationships |
| :--- | :--- | :--- |
| **Clinic** | Tenant Root Entity | Has Many Branches, Users, Specializations |
| **Branch** | Physical Branch Location | Belongs to Clinic, Has Many DoctorBranches |
| **User** | System User Credentials | Belongs to Clinic, 1-to-1 with Doctor |
| **Specialization** | Medical Specialty | Has Many Doctors |
| **Doctor** | Physician Profile | 1-to-1 with User, Has Many DoctorBranches |
| **DoctorBranch** | Doctor Working Settings per Branch | Belongs to Doctor & Branch, Has Many Schedules & Appointments |
| **DoctorSchedule** | Working Hours per Day | Belongs to DoctorBranch |
| **Patient** | Medical Record Subject | Belongs to Clinic, 1-to-1 with MedicalHistory, Has Many Appointments |
| **MedicalHistory** | EMR Background | 1-to-1 with Patient |
| **Appointment** | Scheduled Booking | Belongs to Patient & DoctorBranch, 1-to-1 with Visit |
| **Visit** | Clinical Encounter | 1-to-1 with Appointment, 1-to-1 with Prescription, 1-to-1 with Payment |
| **Prescription** | e-Rx Form | Belongs to Visit, Has Many PrescriptionItems |
| **Payment** | Billing Invoice | Belongs to Visit & User |
