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
    [Table("contains")]
    public class Contains
    {
        [Key, JsonIgnore]
        public required int Recipe_id { get; set; }
        [Key, JsonIgnore]
        public required int Item_id { get; set; }
        [Column("quantity")]
        public required int Quantity { get; set; }
    }
}
