# 🔐 Feature 02: Authentication, Authorization & Role-Based Access Control (RBAC)

## 📌 1. Overview & Security Objectives
SmartClinic enforces enterprise-grade identity, authentication, and granular Role-Based Access Control (RBAC). The system ensures that every user—whether an executive administrator, attending physician, front desk receptionist, or patient—has access strictly to the views, endpoints, and actions appropriate to their professional role.

---

## 🎭 2. The Multi-Role Matrix

| Role | Role Value | Primary Persona | System Access Rights & Capabilities |
|---|---|---|---|
| **PlatformAdmin** | `1` | System Platform Superuser | Global clinic creation, multi-tenant provisioning, tenant health monitoring. |
| **ClinicAdmin** | `2` | Clinic General Manager / Director | Full clinic oversight: Add/manage doctors, configure branches, view financial P&L, system settings. |
| **Doctor** | `3` | Attending Physician / Specialist | Medical practice only: Live waiting queue, clinical visits, diagnosis, e-prescriptions, view clinic colleagues. Cannot add doctors or edit clinic settings. |
| **Receptionist** | `4` | Front Desk Reception Staff | Patient service: Register walk-in patients, book appointments, check-in patients to waiting room, collect payments & billing. Cannot write prescriptions or add doctors. |
| **Patient** | `5` | Registered Healthcare Consumer | Self-service portal: Book consultations, view personal medical history, review e-prescriptions and doctor notes. No access to other patients' records or clinic financials. |

---

## 🔑 3. Authentication Architecture & Security Tokens

### 3.1 Password Security
- Passwords are encrypted using high-entropy salting and hashing via `IPasswordHasher` (`BCrypt` / `PBKDF2`).
- Plaintext passwords are never stored in the database or transmitted in logs.

### 3.2 JWT Access Tokens (Stateless Security)
The `JwtProvider` generates JSON Web Tokens (JWT) signed with HMAC-SHA256 containing:
- `sub`: User unique GUID (`UserId`).
- `email`: User registered email address.
- `name`: Full name.
- `ClinicId`: Organization tenant identifier.
- `role`: Role claim (`ClinicAdmin`, `Doctor`, `Receptionist`, `Patient`).
- `exp`: 60-minute token expiration timestamp.

### 3.3 Refresh Token Rotation
- Secure 7-day cryptographically random refresh tokens stored in `Users.RefreshToken`.
- Allows silent session renewal without forcing re-authentication during daily clinic shifts.

---

## 🚀 4. Account Lifecycle & Workflows

### 4.1 Admin-Managed Doctor Onboarding & Doctor Activation
1. **ClinicAdmin Creates Doctor**: Admin registers doctor email, license, and specialty in `/doctors/new`.
2. **Doctor First-Time Login**: The doctor navigates to `/register` -> **Doctor Activation** tab.
3. **Identity Verification**: The system verifies that the email was pre-registered by clinic administration.
4. **Password Setup**: Doctor establishes their private password. Account status is transitioned to `IsActive = true`.

### 4.2 Patient Self-Registration
1. Patient navigates to `/register` -> **Patient Registration** tab.
2. Inputs Full Name, Email, Phone, Gender, Date of Birth, and Password.
3. System creates a `User` with role `Patient` and simultaneously generates an electronic medical record (`Patient` entity) with a unique medical file code (`P-YYYYMMDD-XXXX`).

### 4.3 Standardized QA & Testing Accounts (1-Click Pills)

| Role | Email | Password | Pre-configured Persona |
|---|---|---|---|
| 👑 **Clinic Admin** | `admin@smartclinic.com` | `Admin@123` | System Administrator |
| 👨‍⚕️ **Doctor (General Test)** | `doctor@smartclinic.com` | `Doctor@123` | Dr. Clinic Specialist |
| 👨‍⚕️ **Doctor** | `tamer@smartclinic.com` | `Doctor@123` | Dr. Tamer Hosny (Cardiology) |
| 💼 **Receptionist** | `receptionist@smartclinic.com` | `Reception@123` | Front Desk Receptionist |
| 🧑‍💼 **Patient** | `patient@smartclinic.com` | `Patient@123` | Ahmed Mahmoud |

---

## 🛡️ 5. Backend Authorization Endpoints

### Controllers and Route Guards
- `POST /api/Auth/login` -> Public. Returns JWT + Refresh Token + User Profile.
- `POST /api/Auth/register-patient` -> Public. Creates patient user and medical record.
- `POST /api/Auth/activate-doctor` -> Public. Verifies pre-approved doctor and sets credentials.
- `POST /api/Doctors` -> `[Authorize(Roles = "ClinicAdmin,PlatformAdmin")]`.
- `POST /api/Appointments/book` -> `[Authorize]`. Available to Receptionist, Admin, Doctor, and Patient.
- `POST /api/Visits/start` -> `[Authorize(Roles = "ClinicAdmin,PlatformAdmin,Doctor")]`.
- `POST /api/Payments/process` -> `[Authorize(Roles = "ClinicAdmin,PlatformAdmin,Receptionist")]`.

---

## 💻 6. Frontend Angular Implementation

- **`AuthService`**: Manages user signals:
  - `currentUser`: Read-only signal with active user data.
  - `isAdmin`: Computed signal checking `ClinicAdmin` or `PlatformAdmin`.
  - `isDoctor`: Computed signal checking `Doctor`.
  - `isReceptionist`: Computed signal checking `Receptionist`.
  - `isPatient`: Computed signal checking `Patient`.
- **`roleGuard` (`core/guards/role.guard.ts`)**: Evaluates the user's role against route permissions before navigation; unauthorized attempts redirect to the user's default dashboard.
- **Dynamic Navigation Sidebar**: Automatically displays only the nav-items permitted for the logged-in role.
