# SmartClinic

### Multi-Tenant Healthcare Management Platform

<p align="center">

A scalable clinic management platform built with modern .NET architecture principles.

</p>

<p align="center">

<img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
<img src="https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
<img src="https://img.shields.io/badge/Angular-TypeScript-DD0031?style=flat-square&logo=angular&logoColor=white" />
<img src="https://img.shields.io/badge/SQL%20Server-Database-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" />
<img src="https://img.shields.io/badge/Architecture-Clean%20Architecture-0078D4?style=flat-square" />
<img src="https://img.shields.io/badge/Pattern-CQRS-6A1B9A?style=flat-square" />

</p>

---

## About

SmartClinic is a multi-tenant healthcare management platform designed to centralize and simplify clinic operations.

The platform provides a unified workflow for managing clinics, branches, doctors, patients, appointments, visits, prescriptions, payments, and access control.

The system is designed with a strong focus on **maintainability, scalability, security, and separation of concerns**.

---

## Key Capabilities

| Area | Capabilities |
| --- | --- |
| Identity | Registration, Login, JWT, Refresh Tokens, Roles |
| Clinics | Multi-Tenant Clinics, Branches, Specializations |
| Doctors | Profiles, Specializations, Branches, Schedules |
| Patients | Profiles, Medical History, Visits |
| Appointments | Scheduling, Status Management |
| Clinical | Visits, Prescriptions, Prescription Items |
| Finance | Payments, Payment Methods, Payment Status |
| Management | Dashboard & Clinic Statistics |

---

## Architecture

SmartClinic follows **Clean Architecture**, keeping the core domain independent from frameworks, infrastructure, and external concerns.

```text
                         ┌─────────────────────┐
                         │    SmartClinic API  │
                         │    Presentation     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Application      │
                         │  CQRS + MediatR     │
                         │ Commands / Queries  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Domain        │
                         │ Entities / Enums    │
                         │ Business Concepts   │
                         └──────────┬──────────┘
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                       ▼                         ▼
              ┌─────────────────┐      ┌─────────────────┐
              │  Infrastructure │      │   Persistence   │
              │ Authentication  │      │ EF Core / SQL   │
              │ JWT / Security  │      │ Repositories    │
              └─────────────────┘      └────────┬────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │ SQL Server   │
                                         └──────────────┘
