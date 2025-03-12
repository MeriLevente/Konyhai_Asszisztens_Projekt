using System.ComponentModel.DataAnnotations;

namespace KonyhaiAsszisztensBackend.Models
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Az email megadása kötelező.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A jelszó megadása kötelező.")]
        public string Password { get; set; }
    }
}
