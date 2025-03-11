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
    [PrimaryKey(nameof(User_Id))]
    [Table("stores")]
    public class Stores
    {
        [JsonIgnore, NotNull]
        public  int User_Id { get; set; }
        [Key, JsonIgnore]
        public required int Item_Id { get; set; }
        [Column("quantity")]
        public required int Quantity { get; set; }
    }
}
