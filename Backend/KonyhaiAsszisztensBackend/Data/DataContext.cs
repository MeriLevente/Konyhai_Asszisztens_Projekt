
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

        public virtual DbSet<Items> Items { get; set; }
        public virtual DbSet<Contains> Contains { get; set; }
        public virtual DbSet<ItemTypes> ItemTypes { get; set; }
        public virtual DbSet<Stores> Stores { get; set; }
        public virtual DbSet<Recipes> Recipes { get; set; }
        public virtual DbSet<Users> Users { get; set; }

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