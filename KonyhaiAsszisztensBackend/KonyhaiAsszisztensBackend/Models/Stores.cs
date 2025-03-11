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
    [Table("stores")]
    public class Stores
    {
        [Key, JsonIgnore]
        public required int User_Id { get; set; }
        [Key, JsonIgnore]
        public required int Item_Id { get; set; }
        [Column("quantity")]
        public required int Quantity { get; set; }
    }
}
