using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extra_EF.Models
{
    [Table("contains")]
    public class Contains
    {
        [Key]
        public int Recipe_id { get; set; }
        [Key]
        public int Item_id { get; set; }
        [Column("quantity")]
        public int Quantity { get; set; }
    }
}
