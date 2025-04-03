using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Models
{
    [Table("users")]
    public class Users
    {
        [Key, SwaggerIgnore]
        public int? Id { get; set; }

        [Column("name"), StringLength(50)]
        public string? Name { get; set; }

        [Column("email"), StringLength(320), NotNull]
        public string Email { get; set; }

        [Column("password"), StringLength(100), NotNull]
        public string Password { get; set; }

        [Column("role"), StringLength(10), SwaggerIgnore]
        public string? Role { get; set; }

        [Column("token"), StringLength(255), SwaggerIgnore]
        public string? Token { get; set; }
    }
}
