# 📚 SmartClinic Documentation Hub

Welcome to the technical documentation library for **SmartClinic Enterprise Multi-Tenant Smart Clinic Management System**. This directory contains detailed architectural specifications, domain models, workflows, and API definitions for each subsystem of the application.

---

## 📑 Feature Documentation Index

| # | Feature Documentation | Core Topics Covered |
|---|---|---|
| **01** | [**Enterprise Multi-Tenancy**](FEATURE_01_MULTI_TENANCY.md) | Clinic isolation, discriminator architecture, tenant security boundaries, zero data leakage. |
| **02** | [**Authentication & RBAC**](FEATURE_02_AUTH_AND_RBAC.md) | Multi-role matrix (Admin, Doctor, Receptionist, Patient), JWT tokens, refresh tokens, role guards. |
| **03** | [**Clinics & Branches**](FEATURE_03_CLINICS_AND_BRANCHES.md) | Multi-branch topology, physical facilities, geographic routing, operating hours. |
| **04** | [**Doctors & Specializations**](FEATURE_04_DOCTORS_AND_SPECIALIZATIONS.md) | Physician onboarding, specialty taxonomy, branch assignments, schedules, clinic colleagues directory. |
| **05** | [**Patients & EMR**](FEATURE_05_PATIENTS_AND_EMR.md) | Walk-in registration, self-registration, medical codes (`P-YYYYMMDD-XXXX`), allergies, medical history. |
| **06** | [**Appointments & Queue**](FEATURE_06_APPOINTMENTS_AND_QUEUE.md) | Scheduling, appointment state machine, receptionist check-in flow, doctor live waiting queue. |
| **07** | [**Clinical Visits & Consultations**](FEATURE_07_CLINICAL_CONSULTATIONS_AND_VISITS.md) | Doctor workspace, electronic examinations, vital signs recording, chief complaints, ICD diagnosis. |
| **08** | [**Electronic Prescriptions (e-Rx)**](FEATURE_08_E_PRESCRIPTIONS.md) | Structured medication catalog, dosage instructions, allergy safety, patient portal access. |
| **09** | [**Billing & Payments**](FEATURE_09_BILLING_AND_PAYMENTS.md) | Consultation fee resolution, cash & card collection, electronic receipts, revenue telemetry. |
| **10** | [**UI/UX & Design System**](FEATURE_10_UI_UX_AND_DESIGN_SYSTEM.md) | Angular 19 Standalone Signals, Dark Glassmorphism, Apple/Stripe-tier Light Mode, CSS tokens. |

---

## 🛠️ Additional Reference Guides

- [**Accounts & Testing Credentials Matrix**](ACCOUNTS_AND_ROLES.md): Pre-seeded accounts, passwords, and 1-click login pills for rapid evaluation.
- [**Development Workflow & Feature Guide**](DEVELOPMENT_GUIDE_FEATURE_WORKFLOW.md): Backend CQRS patterns, MediatR pipeline behaviors, and database migrations.
- [**Frontend Angular Architecture**](FRONTEND_ANGULAR_DOCUMENTATION.md): Signals state management, standalone routing, and responsive layouts.
- [**Quick Run Commands**](RUN_COMMANDS.md): Terminal commands and execution scripts for backend and frontend servers.

---

## 🚀 Root Project Guide
For a high-level executive overview of the entire project, tech stack summary, and 1-click launcher instructions, please refer to the primary root [`README.md`](../README.md).
