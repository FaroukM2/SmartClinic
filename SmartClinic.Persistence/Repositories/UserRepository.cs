using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SmartClinicDbContext _context;

        public UserRepository(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken = default)
        {
            await _context.Users.AddAsync(user, cancellationToken);
        }

        public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
        {
            _context.Users.Update(user);
            return Task.CompletedTask;
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        }
    }
}
