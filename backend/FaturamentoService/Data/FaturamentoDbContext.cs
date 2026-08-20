using Microsoft.EntityFrameworkCore;
using FaturamentoService.Models;

namespace FaturamentoService.Data
{
    public class FaturamentoDbContext : DbContext
    {
        public FaturamentoDbContext(DbContextOptions<FaturamentoDbContext> options) : base(options) { }

        public DbSet<NotaFiscal> NotasFiscais => Set<NotaFiscal>();
        public DbSet<ItemNotaFiscal> ItensNotaFiscal => Set<ItemNotaFiscal>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NotaFiscal>()
                .HasMany(n => n.Itens)
                .WithOne(i => i.NotaFiscal)
                .HasForeignKey(i => i.NotaFiscalId);
        }
    }
}