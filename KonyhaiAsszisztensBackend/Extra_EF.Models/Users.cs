using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Extra_EF.Models
{
    [Table("users")]
    public class Users
    {
        [Key]
        public required int Id { get; set; }
        [Column("name")]
        public required string Name { get; set; }
        [Column("email")]
        public required string Email { get; set; }
        [Column("password")]
        public required string Password { get; set; }
        [Column("role")]
        public required string Role { get; set; }
        [Column("token")]
        public string? Token { get; set; }
    }
}
