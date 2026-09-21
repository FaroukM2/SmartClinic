using SmartClinic.Application.Interfaces.Persistence;
using SmartClinic.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartClinic.Persistence.Services
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SmartClinicDbContext _context;

        public UnitOfWork(SmartClinicDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
