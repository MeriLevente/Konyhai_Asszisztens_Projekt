using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace KonyhaiAsszisztensBackend.Data
{
    public class AuthService : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly DataContext _context;
        public AuthService(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            DataContext context)
            : base(options, logger, encoder)
        {
            _context = context;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "").Trim();

            if (token.Contains('\"')){
                token = token.Split('\"')[1];
            }

            if (string.IsNullOrEmpty(token) || !_context.Users.ToList().Select(x=> x.Token).Contains(token))
            {
                return AuthenticateResult.Fail("Invalid or missing token.");
            }

            var claims = new List<Claim>
            {
            };

            List<string> roles = new List<string>() { "admin", "user" };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var identity = new ClaimsIdentity(claims, "Guid");
            var principal = new ClaimsPrincipal(identity);

            var ticket = new AuthenticationTicket(principal, "Guid");

            return AuthenticateResult.Success(ticket);
        }
    }
}

