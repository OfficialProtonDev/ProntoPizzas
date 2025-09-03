using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProntoPizzas.Models;

namespace ProntoPizzas.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<ProntoPizzas.Models.Order> Order { get; set; } = default!;
        public DbSet<ProntoPizzas.Models.Product> Product { get; set; } = default!;
    }
}
