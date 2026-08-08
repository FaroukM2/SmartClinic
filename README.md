# 🏥 SmartClinic

## Enterprise Multi-Tenant Clinic Management System

![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue?style=for-the-badge)
![CQRS](https://img.shields.io/badge/Pattern-CQRS-orange?style=for-the-badge)

SmartClinic is a modern multi-tenant clinic management system designed to manage the complete healthcare workflow across clinics, branches, doctors, patients, appointments, visits, prescriptions, payments, and user management.

The project is built with **ASP.NET Core 9**, **Clean Architecture**, **CQRS**, and **MediatR**, with a strong focus on maintainability, scalability, security, and separation of concerns.

---

## 📌 Overview

SmartClinic is designed to provide a centralized platform for managing modern clinic operations while supporting multiple clinics and branches within the same system.

The system follows a modular architecture that separates business logic from infrastructure and presentation concerns, making the application easier to maintain, extend, and test.

### Main Objectives

- Support multiple clinics and branches.
- Manage doctors and their schedules.
- Manage patients and medical records.
- Manage appointments and visits.
- Handle prescriptions and payments.
- Provide secure authentication and authorization.
- Maintain clear separation of concerns.
- Provide a scalable foundation for future development.

---

# ✨ Core Features

## 🔐 Authentication & Authorization

- User Registration
- User Login
- JWT Bearer Authentication
- Refresh Token Management
- Secure Password Hashing
- Role-Based Access Control
- User Types
- Authentication Validation
- Last Login Tracking

## 🏢 Clinic Management

- Multi-Tenant Clinic Structure
- Clinic Information
- Clinic Users
- Clinic Roles
- Clinic Branches
- Clinic Patients
- Clinic Specializations

## 🏬 Branch Management

- Branch Management
- Clinic-Based Branches
- Doctor-to-Branch Relationships
- Branch Information

## 👨‍⚕️ Doctor Management

- Doctor Profiles
- Doctor Specializations
- Doctor Branch Assignment
- Doctor Schedules
- Doctor Availability

## 🧑‍🤝‍🧑 Patient Management

- Patient Profiles
- Patient Registration
- Patient Information
- Medical History
- Patient Visits

## 📅 Appointment Management

- Appointment Creation
- Appointment Management
- Appointment Status
- Doctor-Based Appointments
- Patient-Based Appointments

## 🩺 Visit Management

- Patient Visits
- Visit Information
- Visit Types
- Visit Tracking

## 💊 Prescription Management

- Prescription Creation
- Prescription Items
- Visit-Based Prescriptions
- Prescription Management

## 💳 Payment Management

- Payment Records
- Payment Methods
- Payment Status
- Visit-Based Payments

## 📊 Dashboard

- Dashboard Statistics
- Clinic Statistics
- Operational Metrics

---

# 🛠️ Technology Stack

## Backend

- **C#**
- **.NET 9**
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **SQL Server**
- **MediatR**
- **CQRS**
- **FluentValidation**
- **JWT Bearer Authentication**
- **Refresh Tokens**

## Architecture & Design

- Clean Architecture
- Domain-Driven Design Principles
- CQRS
- Repository Pattern
- Unit of Work
- Dependency Injection
- SOLID Principles
- Separation of Concerns
- Dependency Inversion

## Frontend

- **Angular**
- **TypeScript**
- Angular Router
- HTTP Interceptors
- Route Guards
- Feature-Based Architecture

## Development Tools

- Swagger / OpenAPI
- Entity Framework Core Migrations
- SQL Server
- Visual Studio
- Git
- GitHub

---

# 🏛️ Architecture

SmartClinic follows **Clean Architecture** principles.

```text
                         ┌──────────────────────┐
                         │     SmartClinic      │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │     API      │      │ Application  │      │    Domain    │
       └──────┬───────┘      └──────┬───────┘      └──────────────┘
              │                     │
              └─────────────┬───────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Infrastructure  │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   Persistence   │
                   └────────┬────────┘
                            │
                            ▼
                     ┌────────────┐
                     │ SQL Server │
                     └────────────┘
