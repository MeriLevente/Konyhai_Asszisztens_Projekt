
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Models;

namespace KonyhaiAsszisztensBackend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Items> Items { get; set; }
        public DbSet<Contains> Contains { get; set; }
        public DbSet<ItemTypes> ItemTypes { get; set; }
        public DbSet<Stores> Stores { get; set; }
        public DbSet<Recipes> Recipes { get; set; }
        public DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Items>()
                   .HasMany("Stored")
                   .WithOne("StoredItem")
                   .HasForeignKey("ItemId");
            modelBuilder.Entity<Items>()
                   .HasMany("Contained")
                   .WithOne("Item")
                   .HasForeignKey("ItemId");
            modelBuilder.Entity<Contains>()
                    .HasOne("Recipe")
                    .WithMany("Ingredients")
                    .HasForeignKey("RecipeId");
        }
    }
}