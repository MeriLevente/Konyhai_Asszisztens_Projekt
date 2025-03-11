using Microsoft.EntityFrameworkCore;
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
    [PrimaryKey(nameof(Recipe_id))]
    [Table("contains")]
    public class Contains
    {
        [JsonIgnore, NotNull]
        public int Recipe_id { get; set; }
        [Key, JsonIgnore]
        public required int Item_id { get; set; }
        [Column("quantity")]
        public required int Quantity { get; set; }
    }
}
