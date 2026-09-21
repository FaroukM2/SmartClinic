# 🏢 Feature 01: Enterprise Multi-Tenancy & Data Isolation

## 📌 1. Overview & Architectural Objectives
**SmartClinic** is engineered as a high-scalability, enterprise multi-tenant software system for medical institutions, polyclinics, and healthcare networks. Multi-tenancy enables multiple independent medical clinics to share the same computing and database infrastructure while guaranteeing **complete logical and operational isolation**.

---

## 🔒 2. Multi-Tenancy Isolation Model

### 2.1 The Shared Database, Discriminator Isolation Pattern
The system employs a **Discriminator-Based Multi-Tenancy Architecture** via Entity Framework Core:
- Every tenant entity implements the multi-tenant contract with a mandatory `ClinicId (Guid)` foreign key.
- A clinic's medical data, records, patients, billing receipts, and staff belong strictly to that clinic's unique `ClinicId`.
- **Zero Cross-Tenant Leakage**: Queries in MediatR handlers and repositories filter strictly by the authenticated tenant's `ClinicId`.

### 2.2 Security Boundary
- The tenant identity (`ClinicId`) is cryptographically sealed inside the user's **JWT Access Token** upon successful authentication.
- When an API request is received, the `CurrentUserService` extracts the `ClinicId` claim from `HttpContext.User`.
- Direct manipulation of `ClinicId` via client-side request payloads is prohibited or verified against the JWT tenant claim.

---

## 🏛️ 3. Domain Entities & Database Schema

### 3.1 `Clinic` (Root Tenant Entity)
Located in: `SmartClinic.Domain/Entities/Clinics/Clinic.cs`
- `Id (Guid)`: Unique Primary Key identifying the healthcare organization.
- `Name (string)`: Commercial and medical name of the clinic (e.g., "Smart Health Polyclinic").
- `Code (string)`: Unique short organization code (e.g., "SHP-01").
- `Email (string)`: Official organization contact email.
- `PhoneNumber (string)`: Primary contact line.
- `TaxNumber (string?)`: Registered fiscal and tax identification number.
- `IsActive (bool)`: Tenant operational status flag.

### 3.2 Related Tenant Aggregate Collections
- `Branches`: Geographic physical clinic branches.
- `Doctors`: Medical practitioners affiliated with the clinic.
- `Patients`: Electronic medical records of registered patients.
- `Roles`: Custom roles and permissions scoped per clinic.

---

## ⚙️ 4. Data Access & EF Core Configuration

### Configuration (`ClinicConfiguration.cs`)
- Table name: `Clinics`
- Unique index on `Code` to prevent duplicate organization identifiers.
- String length constraints enforced via Fluent API:
  - `Name`: `HasMaxLength(150)`, `IsRequired()`
  - `Code`: `HasMaxLength(50)`, `IsRequired()`
  - `Email`: `HasMaxLength(100)`, `IsRequired()`
  - `PhoneNumber`: `HasMaxLength(20)`, `IsRequired()`
  - `TaxNumber`: `HasMaxLength(50)`

---

## 🌐 5. API Endpoints

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `GET` | `/api/Clinics` | Retrieve current clinic details | `[Authorize]` |
| `POST` | `/api/Clinics` | Register new clinic tenant | `[Authorize(Roles = "PlatformAdmin")]` |
| `PUT` | `/api/Clinics/{id}` | Update clinic configuration & telemetry | `[Authorize(Roles = "ClinicAdmin")]` |

---

## 💻 6. Frontend Tenant Awareness (Angular 19)

- `AuthService.clinicId()`: A reactive Angular `computed()` signal reading the active tenant ID from the authenticated user token.
- `TopbarComponent`: Displays the active clinic name and current physical branch in the header badge.
- Automatic header injection: HTTP Interceptors attach the bearer token, ensuring all backend requests are automatically scoped to the tenant.

---

## 🧪 7. Verification & Testing
- **Cross-Tenant Test**: Queries issued by staff in Clinic A return 0 records from Clinic B.
- **Foreign Key Enforcement**: EF Core cascade deletes are restricted (`DeleteBehavior.Restrict`) to prevent accidental orphaned healthcare records.
