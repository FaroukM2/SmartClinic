# 👨‍⚕️ Feature 04: Doctors, Specializations & Medical Staff Directory

## 📌 1. Overview & Operational Objectives
The **Doctors and Specializations** subsystem manages the medical staffing of the healthcare enterprise. It handles physician profiles, state medical licenses, specialization taxonomy, multi-branch assignments, operating schedules, consultation fees, and internal colleague visibility.

---

## 🏛️ 2. Domain Entities & Database Schema

### 2.1 `Doctor` Entity
Located in: `SmartClinic.Domain/Entities/Doctors/Doctor.cs`
- `Id (Guid)`: Unique identifier for the medical doctor.
- `UserId (Guid)`: Foreign key linking the doctor to their authentication `User` entity.
- `SpecializationId (Guid)`: Link to primary medical specialization.
- `Title (string)`: Professional medical title (e.g., "Senior Consultant", "Associate Professor").
- `LicenseNumber (string)`: Official medical board licensing identification (e.g., `LIC-CARD-2024`).
- `YearsOfExperience (int)`: Years of professional clinical practice.
- `IsActive (bool)`: Medical practicing status.

### 2.2 `Specialization` Entity
- `Id (Guid)`: Unique identifier.
- `Name (string)`: Name of specialty (e.g., "Cardiology", "Pediatrics", "Orthopedic Surgery", "Dermatology").
- `Description (string?)`: Clinical scope of practice description.

### 2.3 `DoctorBranch` & `DoctorSchedule`
- **`DoctorBranch`**: Represents the assignment of a doctor to a physical branch:
  - `ConsultationFee (decimal)`: Base price for initial patient examination.
  - `FollowUpFee (decimal)`: Discounted fee for return visits.
  - `FollowUpDaysLimit (int)`: Grace period (e.g., 14 days) for complimentary or discounted follow-ups.
  - `SlotDurationMinutes (int)`: Consultation slot duration (e.g., 20 or 30 minutes).
- **`DoctorSchedule`**:
  - `DayOfWeek (DayOfWeek)`: Sunday through Saturday.
  - `StartTime (TimeOnly)` & `EndTime (TimeOnly)`: Working shift boundaries.
  - `MaxPatients (int)`: Maximum allowed patient bookings per shift.

---

## 🤝 3. Clinic-Wide Colleague Visibility (New Feature)

### 3.1 Business Need
In collaborative healthcare environments, attending physicians need to see and contact fellow medical specialists working in the same clinic (e.g., for patient referrals, cross-specialty consultations, or coverage).

### 3.2 Backend Implementation
- **Repository Method**: `IDoctorRepository.GetDoctorsByClinicIdAsync(Guid clinicId, CancellationToken ct)`
- **Query**: `GetDoctorsByClinicQuery(Guid ClinicId)`
- **Query Handler**: Fetches all physicians belonging to the clinic across all branches, eagerly loading `User`, `Specialization`, and `DoctorBranches`, mapping to `DoctorDto`.
- **API Endpoint**: `GET /api/v1/doctors/clinic/{clinicId}`

### 3.3 Frontend Representation
1. **Doctor Workspace Dashboard (`/dashboard`)**:
   - A dedicated **"Clinic Specialists & Medical Colleagues"** grid section.
   - Interactive colleague cards displaying: Doctor Name, Specialty badge, Experience years, Phone number, and Covered Branches.
   - Highlights the currently logged-in physician with a distinctive `You` chip.
2. **Specialists Directory (`/doctors`)**:
   - New filter tab: `🏥 All Clinic Branches (All Specialists)`.
   - Allows doctors, receptionists, and administrators to browse all staff members regardless of branch filter.

---

## 🔒 4. Access Control & Security Rules

| Action | Allowed Roles | System Behavior |
|---|---|---|
| **Add New Doctor** (`POST /api/Doctors`) | `ClinicAdmin`, `PlatformAdmin` | Authorized. Button visible only to administrators. |
| **Assign Branch / Schedule** | `ClinicAdmin`, `PlatformAdmin` | Admin sets schedules and consultation fees. |
| **Browse Colleagues Directory** | `Doctor`, `ClinicAdmin`, `Receptionist` | Read-only. Doctor and Receptionist cannot add/delete doctors. |
| **View Specialists (Patient Portal)** | `Patient` | Read-only with direct appointment booking CTA. |

---

## 🌐 5. API Endpoints (`DoctorsController.cs`)

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `GET` | `/api/v1/doctors/clinic/{clinicId}` | Get all doctors in clinic across all branches | `[Authorize]` |
| `GET` | `/api/v1/doctors/branch/{branchId}` | Get doctors assigned to specific branch | `[Authorize]` |
| `GET` | `/api/v1/doctors/{id}` | Get full doctor profile by ID | `[Authorize]` |
| `POST` | `/api/v1/doctors` | Register a new physician | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]` |
| `POST` | `/api/v1/doctors/assign-branch` | Assign doctor to branch with fee settings | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]` |
| `POST` | `/api/v1/doctors/schedule` | Configure weekly working hours and shifts | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]` |
