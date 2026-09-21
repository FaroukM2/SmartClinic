# 👨‍👩‍👧‍👦 Phase 2: Patient Management & Medical History

## 📌 Overview
This document details the implementation of **Phase 2** for the **SmartClinic** backend system, built on **.NET 9** (`net9.0`) using **Clean Architecture** and **CQRS with MediatR**.

Phase 2 introduces comprehensive **Patient Management**, **Electronic Medical History (EMR)**, and **Medical File Attachments**.

---

## 🛠️ Components Implemented

### 1. Persistence Layer (`SmartClinic.Persistence`)
- **Repository Interface** (`SmartClinic.Application/Interfaces/Persistence/IPatientRepository.cs`):
  - Patient CRUD and Search: `AddAsync`, `UpdateAsync`, `GetByIdAsync`, `GetByMedicalCodeAsync`, `SearchAsync`.
  - Medical History Operations: `AddOrUpdateMedicalHistoryAsync`, `GetMedicalHistoryByPatientIdAsync`.
  - Attachment Operations: `AddAttachmentAsync`, `GetAttachmentByIdAsync`, `DeleteAttachmentAsync`, `GetAttachmentsByVisitIdAsync`.
- **Repository Implementation** (`SmartClinic.Persistence/Repositories/PatientRepository.cs`):
  - Implementation of LINQ queries with EF Core including navigation properties (`MedicalHistory`).
  - Search functionality supporting filtering by Patient Name, Primary Phone, or Medical Code.
- **EF Core Configurations** (`SmartClinic.Persistence/Configurations`):
  - `PatientConfiguration.cs`: Medical code auto-indexing per clinic (`ClinicId`, `MedicalCode`), string length constraints, and relationships.
  - `MedicalHistoryConfiguration.cs`: 1-to-1 relationship with `Patient` and text limits for chronic diseases, allergies, past surgeries, and notes.
  - `AttachmentConfiguration.cs`: File path, file type, file name configurations, and relationship with `Visit`.
- **Dependency Injection**:
  - Registered `IPatientRepository` in `SmartClinic.Persistence/DependencyInjection.cs`.

---

### 2. Application Layer (`SmartClinic.Application`)

#### Patients Feature (`Features/Patients`)
- **DTOs**:
  - `PatientDto.cs`: DTO representing patient demographic information and embedded `MedicalHistoryDto`.
  - `MedicalHistoryDto.cs`: DTO representing patient medical history.
  - `AttachmentDto.cs`: DTO representing uploaded medical file attachments.
- **Commands**:
  - `CreatePatientCommand.cs` & `CreatePatientCommandHandler.cs`: Creates a patient and automatically generates a unique `MedicalCode` (Format: `P-yyyyMMdd-XXXX`).
  - `CreatePatientCommandValidator.cs`: FluentValidation for demographic fields, phone number regex, and valid birth dates.
  - `AddOrUpdateMedicalHistoryCommand.cs` & `AddOrUpdateMedicalHistoryCommandHandler.cs`: Adds or updates a patient's medical history (chronic diseases, allergies, surgeries, notes).
- **Queries**:
  - `GetPatientByIdQuery.cs` & `GetPatientByIdQueryHandler.cs`: Retrieves single patient by ID with medical history.
  - `SearchPatientsQuery.cs` & `SearchPatientsQueryHandler.cs`: Searches patients by name, phone, or medical code.
- **Mapping**:
  - `PatientMappingProfile.cs`: AutoMapper mappings for `Patient`, `MedicalHistory`, and `Attachment`.

---

### 3. Presentation Layer (`SmartClinic.API`)
- **[PatientsController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/PatientsController.cs)**:
  - `POST /api/patients` -> Create patient (Generates Medical Code & ID)
  - `GET /api/patients/{id}` -> Get patient profile by ID
  - `GET /api/patients/search?clinicId={clinicId}&searchTerm={term}` -> Search patients
  - `POST /api/patients/medical-history` -> Add/Update medical history

---

## 🧪 Verification & Build Status
- **Framework**: .NET 9 (`net9.0`)
- **Build Status**: `Build Succeeded - 0 Errors, 0 Warnings`
