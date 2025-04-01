using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Models
{
    [Table("recipes")]
    public class Recipes
    {
        [Key]
        public int Id { get; set; }

        [Column("name"), StringLength(40), NotNull]
        public string Name { get; set; }

        [Column("name_EN"), StringLength(40), NotNull]
        public string Name_EN { get; set; }

        [Column("description"), NotNull]
        public string Description { get; set; }

        [Column("description_EN"), NotNull]
        public string Description_EN { get; set; }

        [Column("type"), StringLength(3), NotNull]
        public string Type { get; set; }

        [Column("difficulty"), NotNull]
        public int Difficulty { get; set; }

        [Column("time"), NotNull]
        public int Time { get; set; }

        [Column("image")]
        public string? Image { get; set; }

        [SwaggerIgnore]
        public ICollection<Contains>? Ingredients { get; set; }
    }
}
