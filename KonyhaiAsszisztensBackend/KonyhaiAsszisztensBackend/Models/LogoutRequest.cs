using System.ComponentModel.DataAnnotations;

namespace KonyhaiAsszisztensBackend.Models
{
    public class LogoutRequest
    {
        [Required(ErrorMessage = "A token megadása kötelező.")]
        public string Token { get; set; }
    }
}
