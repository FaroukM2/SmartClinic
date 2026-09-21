# 🚀 SmartClinic — دليل وأوامر تشغيل المشروع (Run Commands Guide)

هذا الملف يحتوي على كافة الأوامر والخطوات اللازمة لتشغيل الـ **Backend** والـ **Frontend** وإعداد قاعدة البيانات وحسابات الاختبار.

---

## 📋 المتطلبات الأساسية (Prerequisites)
1. **.NET 9.0 SDK**: [تحميل .NET 9](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **Node.js (v18+) & npm**: [تحميل Node.js](https://nodejs.org/)
3. **SQL Server**: (LocalDB أو SQL Server Express أو Docker SQL Server)

---

## ⚡ التشغيل السريع بنقرة واحدة (1-Click Launchers)

تم تجهيز ملفين تشغيل في مجلد المشروع الرئيسي:
- **تشغيل الباك إند**: انقر نقراً مزدوجاً على [`run-backend.bat`](file:///f:/Instant/Enterprise%20Multi-Tenant%20Smart%20Clinic%20Management%20System/run-backend.bat)
- **تشغيل الفرونت إند**: انقر نقراً مزدوجاً على [`run-frontend.bat`](file:///f:/Instant/Enterprise%20Multi-Tenant%20Smart%20Clinic%20Management%20System/run-frontend.bat)

---

## 🛠️ 1. تشغيل الـ Backend (.NET 9 Web API)

### أ. تحديث قاعدة البيانات (Database Migrations & Seeding)
افتح التيرمينال (PowerShell أو CMD) من الـ Root، أو ادخل على مجلد الباك إند:

```powershell
cd smartclinic-backend

# تطبيق الترحيلات (Migrations) وإنشاء قاعدة البيانات تلقائياً مع الـ Seed Data
dotnet ef database update --project SmartClinic.Persistence --startup-project SmartClinic.API
```

### ب. بناء المشروع (Build)
```powershell
dotnet build SmartClinic.sln
```

### ج. تشغيل الـ API
```powershell
cd SmartClinic.API
dotnet run --launch-profile https
```
*(أو ادخل عبر ملف المشروع مباشرة: `dotnet run --project smartclinic-backend/SmartClinic.API`)*

### 🌐 روابط الـ Backend:
- **Swagger Documentation**: [https://localhost:7006/swagger](https://localhost:7006/swagger)
- **HTTP Endpoint**: `http://localhost:5239`
- **HTTPS Endpoint**: `https://localhost:7006`

---

## 💻 2. تشغيل الـ Frontend (Angular 19)

### أ. تثبيت الاعتماديات (Dependencies)
افتح نافذة تيرمينال أخرى:
```powershell
cd smartclinic-frontend

# تثبيت الحزم (في أول مرة فقط)
npm install
```

### ب. تشغيل خادم التطوير (Development Server)
```powershell
npm start
# أو
npx ng serve
```

### 🌐 رابط الـ Frontend:
- افتح المتصفح على: [http://localhost:4200](http://localhost:4200)

---

## 🔑 بيانات الدخول التجريبية (Default Seeded Accounts)

تم تجهيز قاعدة البيانات بحسابات تجريبية بكلمة مرور موحدة لكل الأدوار:

| الدور (Role) | البريد الإلكتروني (Email) | كلمة المرور (Password) | الصلاحيات والوظيفة |
|---|---|---|---|
| **System Admin** | `admin@smartclinic.com` | `Admin@123` | إدارة العيادات، الفروع، الأطباء، المرضى |
| **Dr. Tamer Hosny** (Cardiology) | `tamer@smartclinic.com` | `Doctor@123` | كشوفات القلب، الروشتات، المواعيد |
| **Dr. Sarah Mansour** (Pediatrics) | `sarah@smartclinic.com` | `Doctor@123` | كشوفات الأطفال، الروشتات، المواعيد |
| **Dr. Omar Farouk** (Orthopedics) | `omar@smartclinic.com` | `Doctor@123` | جراحة العظام، الروشتات، المواعيد |
| **Dr. Mona El-Sayed** (Dermatology) | `mona@smartclinic.com` | `Doctor@123` | كشوفات الجلدية والتجميل، الروشتات |

### 👥 المرضى المسجلون بقاعدة البيانات (Pre-seeded Patients):
- **Ahmed Mahmoud** (كود: `P-1001` - هاتف: `01011122233` - حساسية: بنسلين)
- **Mariam Youssef** (كود: `P-1002` - هاتف: `01022233344` - حساسية: ربو وغبار)
- **Khaled Mostafa** (كود: `P-1003` - هاتف: `01033344455` - ضغط دم مزمن)
- **Nourhan Ali** (كود: `P-1004` - هاتف: `01044455566` - حساسية: مركبات السلفا)
- **Ibrahim Hassan** (كود: `P-1005` - هاتف: `01055566677` - سكري وضغط)
- **Fatima El-Zahraa** (كود: `P-1006` - هاتف: `01066677788`)

---

## 🗂️ هيكل المجلدات المنظم (Organized Directory Structure)

```text
Enterprise Multi-Tenant Smart Clinic Management System/
│
├── docs/                                  # 📁 كافة ملفات التوثيق ودليل المراحل (Phases)
│   ├── ADVANCED_ARCHITECTURE_AND_INFRASTRUCTURE.md
│   ├── CODE_REVIEW_REPORT.md
│   ├── DEVELOPMENT_GUIDE_FEATURE_WORKFLOW.md
│   ├── FRONTEND_ANGULAR_DOCUMENTATION.md
│   ├── PHASE0_AUTHENTICATION.md
│   ├── PHASE1_DOCTORS_BRANCHES_SPECIALIZATIONS.md
│   ├── PHASE2_PATIENTS_MEDICAL_HISTORY.md
│   ├── PHASE3_APPOINTMENTS_VISITS.md
│   ├── PHASE4_PRESCRIPTIONS_PAYMENTS.md
│   └── PROJECT_OVERVIEW_AND_SERVICES.md
│
├── smartclinic-backend/                   # 📁 مشاريع الباك إند (.NET 9 Clean Architecture)
│   ├── SmartClinic.sln
│   ├── SmartClinic.API/                   # Controllers (Identity/Clinics/Doctors/...)
│   ├── SmartClinic.Application/           # CQRS Features (Commands/Queries/DTOs)
│   ├── SmartClinic.Domain/                # Entities (Identity/Clinics/Doctors/...)
│   ├── SmartClinic.Infrastructure/        # Security, JWT, Token Providers
│   ├── SmartClinic.Persistence/           # EF Core Configurations & Repositories
│   └── SmartClinic.Shared/                # Result Wrapper & Helpers
│
├── smartclinic-frontend/                  # 📁 واجهة المستخدم (Angular 19 SPA)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                      # Guards, Interceptors, Services
│   │   │   ├── features/                  # Auth, Appointments, Doctors, Patients...
│   │   │   └── shared/                    # Reusable Components & Pipes
│   ├── package.json
│   └── angular.json
│
├── run-backend.bat                        # 🚀 تشغيل الباك إند بنقرة واحدة
├── run-frontend.bat                       # 🚀 تشغيل الفرونت إند بنقرة واحدة
├── RUN_COMMANDS.md                        # 📄 هذا الدليل
└── README.md                              # 📖 الملف التعريفي العام بالمشروع
```
