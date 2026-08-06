using Microsoft.EntityFrameworkCore;
using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Domain.Entities;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public async Task<User?> GetByEmailAsync(
            string email,
            CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == email,
                    cancellationToken);
        }

        public Task UpdateAsync(
            User user,
            CancellationToken cancellationToken = default)
        {
            _context.Update(user);

            return Task.CompletedTask;
        }
    }
}
