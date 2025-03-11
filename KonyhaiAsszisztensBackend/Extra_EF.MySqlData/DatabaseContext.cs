using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Extra_EF.Models;

namespace Extra_EF.MySqlData
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }
        
        public DbSet<Contains> ContainsSet { get; set; }
        public DbSet<Items> ItemsSet { get; set; }
        public DbSet<ItemTypes> ItemTypesSet { get; set; }
        public DbSet<Stores> StoresSet { get; set; }
        public DbSet<Recipes> RecipesSet { get; set; }
        public DbSet<Users> UsersSet { get; set; }
    }
}
