using Swashbuckle.AspNetCore.Annotations;
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
    [Table("itemtypes")]
    public class ItemTypes
    {
        [Key]
        public int Id { get; set; }

        [Column("name"), StringLength(30), NotNull]
        public string Name { get; set; }

        [Column("name_EN"), StringLength(30), NotNull]
        public string Name_EN { get; set; }

        [Column("image")]
        public string Image { get; set; }
    }
}
