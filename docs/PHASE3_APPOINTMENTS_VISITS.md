# 📅 Phase 3: Appointments & Visits Management

## 📌 Overview
This document details the implementation of **Phase 3** for the **SmartClinic** backend system, built on **.NET 9** (`net9.0`) using **Clean Architecture** and **CQRS with MediatR**.

Phase 3 introduces **Queue & Appointment Scheduling**, **Appointment Status Lifecycle**, and **Doctor Clinical Consultation Visits**.

---

## 🛠️ Components Implemented

### 1. Persistence Layer (`SmartClinic.Persistence`)
- **Repository Interfaces** (`SmartClinic.Application/Interfaces/Persistence`):
  - `IAppointmentRepository.cs`: Appointment booking, queue number calculation (`GetNextQueueNumberAsync`), and queries by doctor branch or patient.
  - `IVisitRepository.cs`: Clinical visit creation, diagnosis updates, and query by appointment.
- **Repository Implementations** (`SmartClinic.Persistence/Repositories`):
  - `AppointmentRepository.cs`: Automatic incremental Queue Number logic per doctor-branch per day, LINQ navigation loading.
  - `VisitRepository.cs`: Loads visit with prescriptions, payments, attachments, and patient information.
- **EF Core Configurations** (`SmartClinic.Persistence/Configurations`):
  - `AppointmentConfiguration.cs`: Enforces relationship between `Patient`, `DoctorBranch`, and `AppointmentStatus`.
  - `VisitConfiguration.cs`: 1-to-1 relationship with `Appointment` and property length limits for Chief Complaint, Physical Exam, Diagnosis, and Doctor Notes.
- **Dependency Injection**:
  - Registered `IAppointmentRepository` and `IVisitRepository` in `SmartClinic.Persistence/DependencyInjection.cs`.

---

### 2. Application Layer (`SmartClinic.Application`)

#### A. Appointments Feature (`Features/Appointments`)
- **DTOs**:
  - `AppointmentDto.cs`: Represents appointment details, queue number, status, patient name/phone, and doctor/branch info.
- **Commands**:
  - `BookAppointmentCommand.cs` & `BookAppointmentCommandHandler.cs`: Books an appointment and auto-assigns the next `QueueNumber` for the doctor on that date (`AppointmentStatus = Reserved`).
  - `BookAppointmentCommandValidator.cs`: Validates patient, doctor branch, and future/today appointment date.
  - `ChangeAppointmentStatusCommand.cs` & `ChangeAppointmentStatusCommandHandler.cs`: Changes appointment lifecycle status (Reserved, Waiting, InConsultation, Completed, Cancelled, NoShow).
- **Queries**:
  - `GetAppointmentsByDoctorBranchQuery.cs` & `GetAppointmentsByDoctorBranchQueryHandler.cs`: Returns daily queue list for a doctor at a branch.
- **Mapping**:
  - `AppointmentMappingProfile.cs`: Mappings from `Appointment` to `AppointmentDto`.

#### B. Visits Feature (`Features/Visits`)
- **DTOs**:
  - `VisitDto.cs`: Represents clinical exam data, diagnosis, complaints, doctor notes, and flag indicators for prescriptions/payments.
- **Commands**:
  - `StartVisitCommand.cs` & `StartVisitCommandHandler.cs`: Converts an appointment into an active clinical visit and automatically transitions `AppointmentStatus` to `InConsultation`.
  - `UpdateVisitCommand.cs` & `UpdateVisitCommandHandler.cs`: Records examination notes, complaints, diagnosis, and option to complete the visit (`AppointmentStatus = Completed`).
- **Queries**:
  - `GetVisitByIdQuery.cs` & `GetVisitByIdQueryHandler.cs`: Retrieves visit by ID.
- **Mapping**:
  - `VisitMappingProfile.cs`: AutoMapper configuration for `Visit` to `VisitDto`.

---

### 3. Presentation Layer (`SmartClinic.API`)
- **[AppointmentsController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/AppointmentsController.cs)**:
  - `POST /api/appointments/book` -> Book new appointment
  - `PUT /api/appointments/status` -> Update status (Reserved, Waiting, Completed, etc.)
  - `GET /api/appointments/doctor-branch/{doctorBranchId}?date=YYYY-MM-DD` -> Get daily queue list
- **[VisitsController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/VisitsController.cs)**:
  - `POST /api/visits/start` -> Start examination visit (Sets status to `InConsultation`)
  - `PUT /api/visits/update` -> Save diagnosis & notes (Optionally complete visit)
  - `GET /api/visits/{id}` -> Get visit details

---

## 🧪 Verification & Build Status
- **Framework**: .NET 9 (`net9.0`)
- **Build Status**: `Build Succeeded - 0 Errors, 0 Warnings`
