# 🏥 Phase 1: Specializations, Branches & Doctors Management

## 📌 Overview
This document details the implementation of **Phase 1** for the **SmartClinic** backend system, built on **.NET 9** (`net9.0`) using **Clean Architecture** and **CQRS pattern with MediatR**.

This phase establishes the core foundational hierarchy of the clinic (Branches, Specializations, Doctor Profiles, Branch-Doctor Assignments, and Doctor Schedules) which is required before handling Patients, Appointments, and Visits.

---

## 🛠️ Components Implemented

### 1. Persistence Layer (`SmartClinic.Persistence`)
- **Repository Interfaces** (`SmartClinic.Application/Interfaces/Persistence`):
  - `IBranchRepository.cs`: Manages branch persistence operations (`AddAsync`, `UpdateAsync`, `GetByIdAsync`, `GetByClinicIdAsync`).
  - `ISpecializationRepository.cs`: Manages medical specialization persistence operations (`AddAsync`, `UpdateAsync`, `GetByIdAsync`, `GetAllAsync`).
  - `IDoctorRepository.cs`: Manages doctor profiles, `DoctorBranch` assignments, and `DoctorSchedule` entries.
- **Repository Implementations** (`SmartClinic.Persistence/Repositories`):
  - `BranchRepository.cs`: EF Core querying with Clinic navigational property inclusion.
  - `SpecializationRepository.cs`: EF Core querying filtered by `ClinicId`.
  - `DoctorRepository.cs`: Includes `User`, `Specialization`, `DoctorBranches`, `DoctorSchedules`, and relational mappings.
- **EF Core Configurations** (`SmartClinic.Persistence/Configurations`):
  - `BranchConfiguration.cs`: Properties, constraints, and relationships.
  - `SpecializationConfiguration.cs`: Property mappings and FK relationship to Clinic.
  - `DoctorConfiguration.cs`: License number, bio, and 1-to-1 relationship configuration with `User` (`User.Id == Doctor.Id`).
  - `DoctorBranchConfiguration.cs`: Decimal precision for fees (`ConsultationFee`, `FollowUpFee`) and composite unique index (`DoctorId`, `BranchId`).
  - `DoctorScheduleConfiguration.cs`: Working day and time slot mappings with cascade delete behavior.
- **Dependency Injection**:
  - Registered all new repositories in `SmartClinic.Persistence/DependencyInjection.cs`.

---

### 2. Application Layer (`SmartClinic.Application`)

#### A. Branches Feature (`Features/Branches`)
- `BranchDto.cs`: Data Transfer Object representing branch details.
- `CreateBranchCommand.cs` & `CreateBranchCommandHandler.cs`: Creates a new branch for a clinic.
- `CreateBranchCommandValidator.cs`: Validates Name, Address, and Phone format using FluentValidation.
- `UpdateBranchCommand.cs` & `UpdateBranchCommandHandler.cs`: Updates existing branch details.
- `GetBranchByIdQuery.cs` & `GetBranchByIdQueryHandler.cs`: Fetches single branch by ID.
- `GetBranchesByClinicQuery.cs` & `GetBranchesByClinicQueryHandler.cs`: Fetches all branches of a clinic.
- `BranchMappingProfile.cs`: AutoMapper configuration for Branch entity to DTO.

#### B. Specializations Feature (`Features/Specializations`)
- `SpecializationDto.cs`: DTO representing medical specialization.
- `CreateSpecializationCommand.cs` & `CreateSpecializationCommandHandler.cs`: Creates medical specialization.
- `CreateSpecializationCommandValidator.cs`: Validates specialization name and clinic ID.
- `GetAllSpecializationsQuery.cs` & `GetAllSpecializationsQueryHandler.cs`: Returns all specializations for a clinic.
- `SpecializationMappingProfile.cs`: AutoMapper configuration.

#### C. Doctors & Schedules Feature (`Features/Doctors`)
- `DoctorDto.cs`, `DoctorBranchDto.cs`, `DoctorScheduleDto.cs`: Nested DTOs for complete doctor profile visualization including branches and schedules.
- `CreateDoctorCommand.cs` & `CreateDoctorCommandHandler.cs`: Links a registered User account to a Doctor profile with specialization, license number, experience years, and bio.
- `CreateDoctorCommandValidator.cs`: FluentValidation rules for doctor registration.
- `AssignDoctorToBranchCommand.cs` & `AssignDoctorToBranchCommandHandler.cs`: Assigns/updates a doctor at a specific branch, setting custom consultation fee, follow-up fee, follow-up day limits, and slot duration minutes.
- `AssignDoctorToBranchCommandValidator.cs`: Validates non-negative fees and positive slot durations.
- `SetDoctorScheduleCommand.cs` & `SetDoctorScheduleCommandHandler.cs`: Sets working schedule for a doctor at a specific branch (`DayOfWeek`, `StartTime`, `EndTime`, `MaxPatients`).
- `GetDoctorByIdQuery.cs` & `GetDoctorByIdQueryHandler.cs`: Retrieves doctor details with branches and schedules.
- `GetDoctorsByBranchQuery.cs` & `GetDoctorsByBranchQueryHandler.cs`: Retrieves all active doctors assigned to a specific branch.
- `DoctorMappingProfile.cs`: Complex AutoMapper profile connecting `Doctor`, `User`, `Specialization`, `DoctorBranch`, and `DoctorSchedule`.

---

### 3. Presentation Layer (`SmartClinic.API`)
- **[BranchesController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/BranchesController.cs)**:
  - `POST /api/branches` -> Create branch
  - `PUT /api/branches/{id}` -> Update branch
  - `GET /api/branches/{id}` -> Get branch by ID
  - `GET /api/branches/clinic/{clinicId}` -> Get all branches for clinic
- **[SpecializationsController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/SpecializationsController.cs)**:
  - `POST /api/specializations` -> Create specialization
  - `GET /api/specializations/clinic/{clinicId}` -> Get specializations for clinic
- **[DoctorsController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/DoctorsController.cs)**:
  - `POST /api/doctors` -> Create doctor profile
  - `POST /api/doctors/assign-branch` -> Assign doctor to branch with fee settings
  - `POST /api/doctors/schedule` -> Set doctor schedule for branch
  - `GET /api/doctors/{id}` -> Get doctor profile details
  - `GET /api/doctors/branch/{branchId}` -> Get doctors working at branch

---

## 🧪 Verification & Build Status
- **Framework**: .NET 9 (`net9.0`)
- **Build Status**: `Build Succeeded - 0 Errors, 0 Warnings`
