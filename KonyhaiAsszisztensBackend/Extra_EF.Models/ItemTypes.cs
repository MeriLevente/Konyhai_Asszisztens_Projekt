using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extra_EF.Models
{
    [Table("itemtypes")]
    public class ItemTypes
    {
        [Key]
        public required int Id { get; set; }
        [Column("name_HU")]
        public required string Name_HU { get; set; }
        [Column("name_EN")]
        public required string Name_EN { get; set; }
        [Column("image")]
        public required string Image { get; set; }
    }
}
