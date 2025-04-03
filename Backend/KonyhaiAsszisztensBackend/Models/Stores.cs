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
    [Table("stores")]
    public class Stores
    {
        [Key, JsonIgnore, SwaggerIgnore]
        public int? Id { get; set; }

        [Column("userId"), NotNull]
        public int UserId { get; set; }

        [Column("itemId"), NotNull]
        public int ItemId { get; set; }

        [Column("quantity"), NotNull]
        public int Quantity { get; set; }

        [SwaggerIgnore]
        public Items? StoredItem {  get; set; }
    }
}
