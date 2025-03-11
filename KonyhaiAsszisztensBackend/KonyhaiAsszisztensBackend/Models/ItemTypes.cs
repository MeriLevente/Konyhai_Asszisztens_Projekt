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
    [Table("itemtypes")]
    public class ItemTypes
    {
        [Key, JsonIgnore]
        public required int Id { get; set; }
        [Column("name_HU"), StringLength(30)]
        public required string Name_HU { get; set; }
        [Column("name_EN"), StringLength(30)]
        public required string Name_EN { get; set; }
        [Column("image")]
        public required string Image { get; set; }
    }
}
