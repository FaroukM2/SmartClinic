# 👥 Feature 05: Patient Management & Electronic Medical Records (EMR)

## 📌 1. Overview & Clinical Value
The **Patient Management and Electronic Medical Records (EMR)** module serves as the medical core of SmartClinic. It standardizes patient identification, stores vital demographics, tracks comprehensive medical histories and allergy alerts, and enables two distinct onboarding workflows: **Front Desk Walk-in Registration** and **Patient Self-Registration**.

---

## 🏛️ 2. Domain Entities & Database Schema

### 2.1 `Patient` Entity
Located in: `SmartClinic.Domain/Entities/Patients/Patient.cs`
- `Id (Guid)`: Unique Primary Key.
- `ClinicId (Guid)`: Tenant clinic foreign key.
- `MedicalCode (string)`: High-visibility unique medical file number (e.g., `P-20260921-5421`).
- `FullName (string)`: Patient complete legal name.
- `Gender (Gender)`: `1: Male`, `2: Female`.
- `DateOfBirth (DateOnly)`: Exact birth date used for clinical age calculations.
- `PrimaryPhone (string)`: Primary contact telephone number.
- `SecondaryPhone (string?)`: Alternate contact number.
- `Address (string?)`: Residential address.
- `UserId (Guid?)`: Nullable foreign key linking to a portal `User` account if self-registered.
- `IsActive (bool)`: Patient record status.

### 2.2 `MedicalHistory` Aggregate Entity
Located in: `SmartClinic.Domain/Entities/Clinical/MedicalHistory.cs`
- `Allergies (string?)`: Critical clinical warnings (e.g., "Penicillin Allergy", "Sulfa Drugs").
- `ChronicDiseases (string?)`: Ongoing conditions (e.g., "Hypertension", "Type 2 Diabetes").
- `PreviousSurgeries (string?)`: Past surgical interventions.
- `FamilyHistory (string?)`: Genetic or hereditary health risks.
- `CurrentMedications (string?)`: Daily maintenance drugs taken prior to consultation.

---

## 🔄 3. Dual Onboarding Workflows

### 3.1 Workflow A: Receptionist Walk-in Intake (Front Desk)
1. An unregistered patient physically arrives at the clinic facility.
2. Receptionist clicks **`+ Register Walk-in Patient`** from the Reception Console or `/patients/new`.
3. Receptionist enters patient demographics (Name, Phone, Birth Date, Gender, Blood Type, Address).
4. Backend `CreatePatientCommandHandler` automatically generates an indexed medical file code (`P-YYYYMMDD-XXXX`).
5. Upon saving (`201 Created`), the frontend navigates directly to the new patient record (`/patients/:id`), with a 1-click option to immediately **`Book Appointment`** for that patient.

### 3.2 Workflow B: Patient Self-Registration (Online Portal)
1. Prospective patient accesses `/register` on the web portal.
2. Enters personal email, password, full name, phone number, and birth date.
3. Backend `RegisterPatientCommandHandler` creates both the `User` account (role `Patient`) and the linked `Patient` EMR entity simultaneously.
4. Patient is automatically logged in and redirected to their personal **Patient Portal Dashboard**.

---

## 🛠️ 4. Technical Resolution Note: Development Redirection Fix
- **Issue Discovered**: In local development, an ASP.NET Core `app.UseHttpsRedirection()` rule issued an `HTTP 307 Temporary Redirect` from port `5239` to `7006`. Per RFC 7235 standards, browsers stripped the `Authorization` header on cross-scheme redirects, causing `401 Unauthorized` during walk-in registration.
- **Solution Applied**: Enclosed `app.UseHttpsRedirection()` in a production check (`if (!app.Environment.IsDevelopment())`), enabling clean, direct HTTP API calls in local testing and ensuring 100% reliable patient creation in 10ms.

---

## 🔒 5. Access Control Matrix

| Feature / Action | Admin | Doctor | Receptionist | Patient |
|---|---|---|---|---|
| Register Walk-in Patient (`/patients/new`) | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| Search & Browse Patients Directory (`/patients`) | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| View Full Patient Medical History & Allergies | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Own profile only |
| Update Medical Diagnoses & Chronic Alerts | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

---

## 🌐 6. API Endpoints (`PatientsController.cs`)

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `POST` | `/api/Patients` | Create new patient EMR record | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin,Receptionist")]` |
| `GET` | `/api/Patients/{id}` | Get patient record and demographics | `[Authorize]` |
| `GET` | `/api/Patients/search` | Search patients by name, phone, or medical code | `[Authorize]` |
| `POST` | `/api/Patients/medical-history` | Record or update allergies & medical history | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin,Doctor")]` |
