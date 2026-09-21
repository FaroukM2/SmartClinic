# 🏥 Feature 03: Clinics & Physical Branches Management

## 📌 1. Overview & Business Context
Modern healthcare networks operate across multiple physical facilities, satellite clinics, and polyclinic branches. SmartClinic provides a centralized management layer allowing healthcare administrators to manage physical branch networks under a single parent medical organization.

---

## 🏛️ 2. Domain Entities & Database Schema

### 2.1 `Branch` Entity
Located in: `SmartClinic.Domain/Entities/Clinics/Branch.cs`
- `Id (Guid)`: Unique identifier for the branch facility.
- `ClinicId (Guid)`: Foreign key referencing parent `Clinic`.
- `Name (string)`: Commercial branch name (e.g., "Downtown Central Branch", "West Cairo Medical Center").
- `Address (string)`: Detailed geographic address.
- `PhoneNumber (string)`: Dedicated branch desk phone number.
- `IsActive (bool)`: Operational status flag.

### 2.2 Navigation Properties & Relationships
- **Clinic to Branches (1-to-Many)**: A Clinic contains one or more physical branches.
- **Branch to DoctorBranches (1-to-Many)**: Doctors are assigned to branches through the `DoctorBranch` join entity with custom consultation fees and schedules per branch.
- **Branch to Appointments (1-to-Many)**: Appointments are scheduled at a specific physical branch.

---

## ⚙️ 3. CQRS Implementation (Application Layer)

### 3.1 Queries
- **`GetBranchesByClinicQuery`**:
  - Fetches all active physical facilities for the authenticated clinic tenant.
  - Used in topbar branch selectors, appointment booking dropdowns, and clinic administration views.
- **`GetBranchByIdQuery`**:
  - Retrieves specific facility details including assigned medical staff and operating hours.

### 3.2 Commands
- **`CreateBranchCommand`**:
  - Parameters: `ClinicId`, `Name`, `Address`, `PhoneNumber`.
  - Restricted to `ClinicAdmin` and `PlatformAdmin`.
- **`UpdateBranchCommand`**:
  - Modifies branch location, phone contact, or toggles operational status.

---

## 🌐 4. API Endpoints (`BranchesController.cs`)

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `GET` | `/api/Branches/clinic/{clinicId}` | List all branches belonging to a clinic | `[Authorize]` |
| `GET` | `/api/Branches/{id}` | Retrieve single branch details | `[Authorize]` |
| `POST` | `/api/Branches` | Create a new physical branch | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]` |
| `PUT` | `/api/Branches/{id}` | Update branch facility details | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]` |

---

## 💻 5. Frontend User Experience (Angular 19)

### 5.1 Branch Switcher in Topbar
- The global `TopbarComponent` displays the currently selected physical branch (e.g., `"Downtown Central Branch"`).
- Staff members can switch branch context to filter today's waiting room and doctor schedules.

### 5.2 Branches Directory (`/branches`)
- Comprehensive card grid showing all physical clinic locations.
- Status badges: `Active Operating` vs. `Maintenance / Closed`.
- Direct telephone links and full street addresses.
- Access protected via `roleGuard(['ClinicAdmin', 'PlatformAdmin'])`.
