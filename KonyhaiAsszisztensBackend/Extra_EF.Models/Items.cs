using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extra_EF.Models
{
    [Table("items")]
    public class Items
    {
        [Key]
        public required int Id { get; set; }
        [Column("name")]
        public required string Name { get; set; }
        [Column("name_EN")]
        public required string Name_EN { get; set; }
        [Column("typeId")]
        public required int TypeId { get; set; }
        [Column("unit")]
        public string? Unit { get; set; }
        [Column("image")]
        public string? Image { get; set; }
    }
}
