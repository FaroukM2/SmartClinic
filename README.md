# 🏥 SmartClinic

### Enterprise Multi-Tenant Healthcare Management Platform

[![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![ASP.NET Core 9](https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet)
[![Angular](https://img.shields.io/badge/Angular-TypeScript-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-0078D4?style=for-the-badge)]()
[![CQRS](https://img.shields.io/badge/Pattern-CQRS-6A1B9A?style=for-the-badge)]()

> A scalable healthcare management platform built to centralize clinic operations across multiple tenants, branches, healthcare professionals, and patients.

---

## Overview

**SmartClinic** is a multi-tenant healthcare management platform built with **ASP.NET Core 9** and designed around modern enterprise software architecture principles.

The platform provides a unified workflow for managing:

- 🏢 Clinics & Branches
- 👨‍⚕️ Doctors & Specializations
- 🧑‍🤝‍🧑 Patients & Medical Records
- 📅 Appointments & Visits
- 💊 Prescriptions
- 💳 Payments
- 🔐 Authentication & Authorization

The system is designed with a strong focus on:

**Scalability · Maintainability · Security · Testability · Separation of Concerns**

---

## Architecture

SmartClinic follows **Clean Architecture**, keeping business logic independent from frameworks, databases, and external infrastructure.

```text
                         ┌─────────────────────┐
                         │   SmartClinic API   │
                         │   Presentation      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Application      │
                         │  CQRS • MediatR     │
                         │ Commands • Queries  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Domain        │
                         │ Entities • Enums    │
                         │ Business Concepts   │
                         └─────────────────────┘

                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │  Infrastructure  │                │   Persistence    │
        │                  │                │                  │
        │ JWT / Security   │                │ EF Core          │
        │ External Services│                │ Repositories     │
        └──────────────────┘                │ Migrations       │
                                            └────────┬─────────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │ SQL Server  │
                                              └─────────────┘
