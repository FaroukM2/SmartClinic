# 🛠️ Developer Guide: How to Build a Feature from Scratch to Finish

This guide provides a comprehensive, step-by-step walkthrough of how features are designed and constructed in the **SmartClinic** codebase using **Clean Architecture**, **CQRS with MediatR**, and **EF Core 9**.

---

## 🎯 The Clean Architecture Request Flow

When an HTTP Request comes into the API, it travels through the solution layers in the following order:

```text
HTTP Request
     │
     ▼
Presentation Layer: API Controller (e.g. BranchesController)
     │
     ▼  Sends Command/Query via MediatR Pipeline
Application Layer: FluentValidation ➔ Handler ➔ Uses Repository
     │
     ▼
Persistence Layer: Repository ➔ EF Core DbContext ➔ SQL Server
     │
     ▼  Returns Domain Entity
Application Layer: AutoMapper maps Entity ➔ DTO
     │
     ▼  Returns DTO
Presentation Layer: Returns IActionResult (HTTP 200 OK / 201 Created)
```

---

## 🪜 Step-by-Step Feature Implementation Workflow

To add a new feature (e.g., `Branch` management), follow these **8 steps** in order:

---

### Step 1: Create the Domain Entity (`SmartClinic.Domain`)
Define your entity inside `SmartClinic.Domain/Entities/`. It should inherit from `AuditableEntity` (which includes `Id`, `CreatedOn`, `CreatedBy`, `LastModifiedOn`, `LastModifiedBy`, `IsDeleted`, `DeletedOn`).

**File**: `SmartClinic.Domain/Entities/Branch.cs`
```csharp
using SmartClinic.Domain.Common;

namespace SmartClinic.Domain.Entities
{
    public class Branch : AuditableEntity
    {
        public Guid ClinicId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool IsMainBranch { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public Clinic Clinic { get; set; } = null!;
    }
}
```

---

### Step 2: Define the Repository Interface (`SmartClinic.Application`)
Define the persistence contract inside `SmartClinic.Application/Interfaces/Persistence/`.

**File**: `SmartClinic.Application/Interfaces/Persistence/IBranchRepository.cs`
```csharp
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Interfaces.Persistence
{
    public interface IBranchRepository
    {
        Task AddAsync(Branch branch, CancellationToken cancellationToken = default);
        Task UpdateAsync(Branch branch, CancellationToken cancellationToken = default);
        Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Branch>> GetByClinicIdAsync(Guid clinicId, CancellationToken cancellationToken = default);
    }
}
```

---

### Step 3: Implement EF Core Repository & Configuration (`SmartClinic.Persistence`)

#### A. Configure Table Mapping
**File**: `SmartClinic.Persistence/Configurations/BranchConfiguration.cs`
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Persistence.Configurations
{
    public class BranchConfiguration : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            builder.ToTable("Branches");
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
            builder.Property(b => b.Address).IsRequired().HasMaxLength(200);
            builder.Property(b => b.Phone).IsRequired().HasMaxLength(20);
        }
    }
}
```

#### B. Implement Repository
**File**: `SmartClinic.Persistence/Repositories/BranchRepository.cs`
```csharp
using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;

namespace SmartClinic.Persistence.Repositories
{
    public class BranchRepository : IBranchRepository
    {
        private readonly SmartClinicDbContext _context;

        public BranchRepository(SmartClinicDbContext context) => _context = context;

        public async Task AddAsync(Branch branch, CancellationToken cancellationToken = default)
            => await _context.Branches.AddAsync(branch, cancellationToken);

        public Task UpdateAsync(Branch branch, CancellationToken cancellationToken = default)
        {
            _context.Branches.Update(branch);
            return Task.CompletedTask;
        }

        public async Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => await _context.Branches.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        public async Task<IReadOnlyList<Branch>> GetByClinicIdAsync(Guid clinicId, CancellationToken cancellationToken = default)
            => await _context.Branches.Where(b => b.ClinicId == clinicId).ToListAsync(cancellationToken);
    }
}
```

#### C. Register in DI
Register in `SmartClinic.Persistence/DependencyInjection.cs`:
```csharp
services.AddScoped<IBranchRepository, BranchRepository>();
```

---

### Step 4: Create Feature DTOs (`SmartClinic.Application`)
Define Data Transfer Objects returned to the client inside `Features/[FeatureName]/DTOs/`.

**File**: `SmartClinic.Application/Features/Branches/DTOs/BranchDto.cs`
```csharp
namespace SmartClinic.Application.Features.Branches.DTOs
{
    public class BranchDto
    {
        public Guid Id { get; set; }
        public Guid ClinicId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool IsMainBranch { get; set; }
        public bool IsActive { get; set; }
    }
}
```

---

### Step 5: Implement CQRS Commands, Queries & Handlers (`SmartClinic.Application`)

#### A. Command Example (Write Operation)
**Command**: `Features/Branches/Commands/CreateBranch/CreateBranchCommand.cs`
```csharp
using MediatR;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public sealed record CreateBranchCommand(
        Guid ClinicId,
        string Name,
        string Address,
        string Phone,
        bool IsMainBranch
    ) : IRequest<Guid>;
}
```

**Handler**: `Features/Branches/Commands/CreateBranch/CreateBranchCommandHandler.cs`
```csharp
using MediatR;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public class CreateBranchCommandHandler : IRequestHandler<CreateBranchCommand, Guid>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateBranchCommandHandler(IBranchRepository branchRepository, IUnitOfWork unitOfWork)
        {
            _branchRepository = branchRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateBranchCommand request, CancellationToken cancellationToken)
        {
            var branch = new Branch
            {
                ClinicId = request.ClinicId,
                Name = request.Name,
                Address = request.Address,
                Phone = request.Phone,
                IsMainBranch = request.IsMainBranch,
                IsActive = true
            };

            await _branchRepository.AddAsync(branch, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return branch.Id;
        }
    }
}
```

#### B. Query Example (Read Operation)
**Query**: `Features/Branches/Queries/GetBranchById/GetBranchByIdQuery.cs`
```csharp
using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchById
{
    public sealed record GetBranchByIdQuery(Guid Id) : IRequest<BranchDto?>;
}
```

**Handler**: `Features/Branches/Queries/GetBranchById/GetBranchByIdQueryHandler.cs`
```csharp
using AutoMapper;
using MediatR;
using SmartClinic.Application.Features.Branches.DTOs;
using SmartClinic.Application.Interfaces.Persistence;

namespace SmartClinic.Application.Features.Branches.Queries.GetBranchById
{
    public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, BranchDto?>
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IMapper _mapper;

        public GetBranchByIdQueryHandler(IBranchRepository branchRepository, IMapper mapper)
        {
            _branchRepository = branchRepository;
            _mapper = mapper;
        }

        public async Task<BranchDto?> Handle(GetBranchByIdQuery request, CancellationToken cancellationToken)
        {
            var branch = await _branchRepository.GetByIdAsync(request.Id, cancellationToken);
            return branch is null ? null : _mapper.Map<BranchDto>(branch);
        }
    }
}
```

---

### Step 6: Add FluentValidation Rules (`SmartClinic.Application`)
Define input validation rules inside `Features/[FeatureName]/Commands/[CommandName]/`.

**File**: `Features/Branches/Commands/CreateBranch/CreateBranchCommandValidator.cs`
```csharp
using FluentValidation;

namespace SmartClinic.Application.Features.Branches.Commands.CreateBranch
{
    public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
    {
        public CreateBranchCommandValidator()
        {
            RuleFor(x => x.ClinicId).NotEmpty().WithMessage("Clinic ID is required.");
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Phone).NotEmpty().Matches(@"^\+?[0-9]{8,15}$");
        }
    }
}
```

---

### Step 7: Define AutoMapper Profile (`SmartClinic.Application`)
Map entity to DTO inside `Features/[FeatureName]/Mapping/`.

**File**: `Features/Branches/Mapping/BranchMappingProfile.cs`
```csharp
using AutoMapper;
using SmartClinic.Application.Features.Branches.DTOs;
using SmartClinic.Domain.Entities;

namespace SmartClinic.Application.Features.Branches.Mapping
{
    public class BranchMappingProfile : Profile
    {
        public BranchMappingProfile()
        {
            CreateMap<Branch, BranchDto>();
        }
    }
}
```

---

### Step 8: Build REST Controller (`SmartClinic.API`)
Expose HTTP endpoints inside `SmartClinic.API/Controllers/`.

**File**: `SmartClinic.API/Controllers/BranchesController.cs`
```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartClinic.Application.Features.Branches.Commands.CreateBranch;
using SmartClinic.Application.Features.Branches.Queries.GetBranchById;

namespace SmartClinic.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BranchesController : ControllerBase
{
    private readonly IMediator _mediator;

    public BranchesController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBranchCommand command)
    {
        var branchId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = branchId }, branchId);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetBranchByIdQuery(id));
        return result is null ? NotFound() : Ok(result);
    }
}
```

---

## 🔍 Step 9: Verify & Build

Run compilation test via CLI:
```bash
dotnet build SmartClinic.API/SmartClinic.API.sln
```
Ensure **0 Errors, 0 Warnings**!
