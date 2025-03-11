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
        [Key, JsonIgnore, NotNull]
        public int Id { get; set; }
        [Column("name"), StringLength(50)]
        public required string Name { get; set; }
        [Column("email"), StringLength(320)]
        public required string Email { get; set; }
        [Column("password"), StringLength(100)]
        public required string Password { get; set; }
        [Column("role"), StringLength(10)]
        public required string Role { get; set; }
        [Column("token"), StringLength(255)]
        public string? Token { get; set; }
    }
}
