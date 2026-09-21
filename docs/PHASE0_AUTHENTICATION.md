# 🔐 Phase 0: Authentication & Authorization Management

## 📌 Overview
This document details the implementation of **Phase 0 (Authentication & Authorization)** for the **SmartClinic** backend system, built on **.NET 9** (`net9.0`) using **Clean Architecture** and **CQRS with MediatR**.

Phase 0 handles **User Registration**, **User Login**, **JWT Bearer Token Generation**, **Refresh Token Management**, and **Role-Based Access Control (RBAC)**.

---

## 🛠️ Components Implemented

### 1. Domain & Interfaces Layer (`SmartClinic.Domain` & `SmartClinic.Application`)
- **Entities**:
  - `User.cs`: Audit-tracked user entity storing credentials, `PasswordHash`, `RefreshToken`, `RefreshTokenExpiry`, `LastLogin`, and `UserType`.
  - `Role.cs` & `UserRole.cs`: Supporting Role-Based Access Control (RBAC).
- **Authentication Interfaces** (`SmartClinic.Application/Interfaces/Authentication`):
  - `IJwtProvider.cs`: Declares methods for `GenerateToken(User user)` and `GenerateRefreshToken()`.
  - `IPasswordHasher.cs`: Declares methods for `Hash(string password)` and `Verify(string password, string passwordHash)`.
- **Repository Interface** (`SmartClinic.Application/Interfaces/Persistence`):
  - `IUserRepository.cs`: Declares `AddAsync`, `UpdateAsync`, `GetByEmailAsync`, and `GetByIdAsync`.

---

### 2. Persistence & Infrastructure Layers (`SmartClinic.Persistence` & `SmartClinic.Infrastructure`)
- **UserRepository** (`SmartClinic.Persistence/Repositories/UserRepository.cs`):
  - Queries `User` entity including `UserRoles` and `Role` navigation properties via EF Core.
- **EF Core Configurations** (`SmartClinic.Persistence/Configurations`):
  - `UserConfiguration.cs`: Unique index on `Email`, string constraints for `FullName`, `Email`, `PhoneNumber`, and 1-to-1 mapping with `Doctor`.
  - `RoleConfiguration.cs` & `UserRoleConfiguration.cs`: Role mapping and composite key setup.
- **Infrastructure Services** (`SmartClinic.Infrastructure`):
  - `JwtProvider.cs`: Generates JWT tokens containing User ID, Email, Clinic ID, UserType claims, and secure 7-day Refresh Tokens.
  - `PasswordHasher.cs`: Secure password hashing and verification using HMACSHA256 / BCrypt algorithms.

---

### 3. Application Layer (`SmartClinic.Application`)

#### Authentication Feature (`Features/Authentication`)
- **Commands & Handlers**:
  - `LoginCommand.cs` & `LoginCommandHandler.cs`: Authenticates user email/password, updates `RefreshToken`, `RefreshTokenExpiry`, and `LastLogin`, returning JWT access token.
  - `LoginCommandValidator.cs`: Validates non-empty email and password formats.
  - `RegisterUserCommand.cs` & `RegisterUserCommandHandler.cs`: Registers a new user for a clinic, hashes password, saves record, and returns immediate authentication tokens.
  - `RegisterUserCommandValidator.cs`: Validates email format, password minimum length, full name, and clinic ID.
- **DTOs**:
  - `LoginResponse.cs`: Returns `Token`, `RefreshToken`, and `Expiration` DateTime.

---

### 4. Presentation Layer (`SmartClinic.API`)
- **[AuthController.cs](file:///f:/Instant/Graduation%20Project_withAntigravity/SmartClinic.API/Controllers/AuthController.cs)**:
  - `POST /api/auth/login` -> Authenticates user and returns JWT token
  - `POST /api/auth/register` -> Registers new user account and returns JWT token

---

## 🧪 Verification & Build Status
- **Framework**: .NET 9 (`net9.0`)
- **Build Status**: `Build Succeeded - 0 Errors, 0 Warnings`
