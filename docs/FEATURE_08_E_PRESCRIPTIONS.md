# 💊 Feature 08: Electronic Prescriptions (e-Rx)

## 📌 1. Overview & Clinical Benefits
The **Electronic Prescriptions (e-Rx)** engine eliminates paper-based errors, illegible handwriting risks, and medication dosage ambiguities. It enables physicians to generate structured, digital prescriptions tied directly to clinical consultation encounters, which patients can access instantly via their personal portal.

---

## 🏛️ 2. Domain Entities & Database Schema

### 2.1 `Prescription` Entity (Aggregate Root)
Located in: `SmartClinic.Domain/Entities/Clinical/Prescription.cs`
- `Id (Guid)`: Unique prescription identifier.
- `VisitId (Guid)`: Encounter during which the prescription was issued.
- `PrescriptionDate (DateTime)`: Date of issuance.
- `Notes (string?)`: Overall lifestyle or dietary recommendations (e.g., "Drink abundant water, low sodium diet").

### 2.2 `PrescriptionItem` Entity
Located in: `SmartClinic.Domain/Entities/Clinical/PrescriptionItem.cs`
- `Id (Guid)`: Unique line item identifier.
- `PrescriptionId (Guid)`: Foreign key to parent prescription.
- `MedicineName (string)`: Commercial or generic drug name (e.g., "Amoxicillin 500mg", "Concor 5mg").
- `Dosage (string)`: Specific measurement (e.g., "1 tablet", "10ml syrup").
- `Frequency (string)`: Administration interval (e.g., "Every 8 hours", "Once daily before breakfast").
- `Duration (string)`: Course length (e.g., "7 days", "1 month").
- `Instructions (string?)`: Special guidance (e.g., "Take after meals with a full glass of water").

---

## 🔒 3. Clinical Workflow & Safety Checks

1. **Allergy Cross-Referencing**:
   - Before prescribing, the physician reviews the patient's recorded allergies highlighted on the visit screen (e.g., Penicillin warnings).
2. **Itemized Drug Builder**:
   - Doctor adds medications row by row with autocomplete and pre-defined dosage intervals.
3. **Instant Digital Publication**:
   - Upon completing the visit, the prescription is securely saved and linked to the patient's EMR record.
4. **Patient Access via Portal**:
   - When the patient logs into `/dashboard` (Patient Portal), their active e-prescriptions appear immediately under **"Recent E-Prescriptions"** with full dosages, frequencies, and doctor instructions.

---

## 🌐 4. API Endpoints (`PrescriptionsController.cs`)

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `POST` | `/api/Prescriptions` | Create an e-prescription with line items | `[Authorize(Roles = "ClinicAdmin,PlatformAdmin,Doctor")]` |
| `GET` | `/api/Prescriptions/visit/{visitId}` | Retrieve prescription for a clinical encounter | `[Authorize]` |
| `GET` | `/api/Prescriptions/patient/{patientId}` | Retrieve full prescription history for a patient | `[Authorize]` |

---

## 💻 5. Frontend Presentation

- **Doctor Workspace (`/visits/:id`)**:
  - Interactive medication table allowing dynamic addition/removal of prescription items.
  - Print button for hardcopy pharmacy dispensing when required.
- **Patient Portal (`/dashboard`)**:
  - Clean medication card view showing medicine name, dosage pill icon, frequency instructions, and issuing doctor's name and specialty.
