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
    [Table("items")]
    public class Items
    {
        [Column("id"), Key, SwaggerIgnore]
        public int Id { get; set; }

        [Column("name"), StringLength(50), NotNull]
        public string Name { get; set; }

        [Column("name_EN"), StringLength(50), NotNull]
        public string Name_EN { get; set; }

        [Column("typeId"), NotNull]
        public int TypeId { get; set; }

        [Column("unit"), StringLength(10)]
        public string? Unit { get; set; }

        [Column("image")]
        public string? Image { get; set; }

        [JsonIgnore, SwaggerIgnore]
        public List<Stores>? Stored { get; set; }

        [JsonIgnore, SwaggerIgnore]
        public List<Contains>? Contained { get; set; }
    }
}
