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
    [Table("contains")]
    public class Contains
    {
        [Key, JsonIgnore, SwaggerIgnore]
        public int? Id { get; set; }

        [Column("recipeId"), NotNull]
        public int RecipeId { get; set; }

        [Column("itemId"), NotNull]
        public int ItemId { get; set; }

        [Column("quantity"), NotNull]
        public int Quantity { get; set; }

        [SwaggerIgnore]
        public Items? Item { get; set; }

        [JsonIgnore, SwaggerIgnore]
        public Recipes? Recipe { get; set; }
    }
}
