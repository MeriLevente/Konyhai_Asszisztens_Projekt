using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Models
{
    [Table("recipes")]
    public class Recipes
    {
        [Key, JsonIgnore]
        public required int Id { get; set; }
        [Column("name"), StringLength(30)]
        public required string Name { get; set; }
        [Column("name_EN"), StringLength(30)]
        public required string Name_EN { get; set; }
        [Column("description_HU")]
        public required string Description { get; set; }
        [Column("description_EN")]
        public required string Description_EN { get; set; }
        [Column("type"), StringLength(3)]
        public required string Type { get; set; }
        [Column("difficulty")]
        public required int Difficulty { get; set; }
        [Column("time")]
        public required int Time { get; set; }
        [Column("image")]
        public string? Image { get; set; }
    }
}
