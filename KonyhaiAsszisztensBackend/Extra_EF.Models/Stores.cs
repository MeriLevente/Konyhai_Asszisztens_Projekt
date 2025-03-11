using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extra_EF.Models
{
    [Table("stores")]
    public class Stores
    {
        [Key]
        public required int User_Id { get; set; }
        [Key]
        public required int Item_Id { get; set; }
        [Column("quantity")]
        public required int Quantity { get; set; }
    }
}
