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
    [Table("items")]
    public class Items
    {
        [Key, JsonIgnore]
        public required int Id { get; set; }
        [Column("name"), StringLength(50)]
        public required string Name { get; set; }
        [Column("name_EN"), StringLength(50)]
        public required string Name_EN { get; set; }
        [Column("typeId")]
        public required int TypeId { get; set; }
        [Column("unit"), StringLength(10)]
        public string? Unit { get; set; }
        [Column("image")]
        public string? Image { get; set; }
    }
}
