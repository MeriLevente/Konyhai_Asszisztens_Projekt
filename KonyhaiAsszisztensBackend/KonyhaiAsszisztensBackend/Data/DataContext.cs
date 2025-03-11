
using Microsoft.EntityFrameworkCore;
using Models;

namespace KonyhaiAsszisztensBackend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Items> ItemsSet { get; set; }
        public DbSet<Contains> ContainsSet { get; set; }
        public DbSet<ItemTypes> ItemTypesSet { get; set; }
        public DbSet<Stores> StoresSet { get; set; }
        public DbSet<Recipes> RecipesSet { get; set; }
        public DbSet<Users> UsersSet { get; set; }
    }
}
