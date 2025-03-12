using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        public UserController(DataContext context)
        {
            _context = context;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetAllUsers()
        {
            return await _context.UsersSet.ToListAsync();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _context.UsersSet.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        [HttpPost]
        public async Task<ActionResult<Users>> CreateUser(Users newUser)
        {
            var errors = new List<ErrorMessage>();

            if (!ModelState.IsValid)
            {
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        errors.Add(new ErrorMessage(
                            state.Key, 
                            error.ErrorMessage, 
                            GetEnglishMessage(state.Key, error.ErrorMessage) 
                        ));
                    }
                }
                return BadRequest(errors);
            }

            if (!IsValidEmail(newUser.Email))
            {
                errors.Add(new ErrorMessage(
                    "Email",
                    "Érvénytelen email cím formátum.",
                    "Invalid email address format."
                ));
                return BadRequest(errors);
            }

            if (newUser.Password.Length < 8)
            {
                errors.Add(new ErrorMessage(
                    "Password",
                    "A jelszónak legalább 8 karakter hosszúnak kell lennie.",
                    "The password must be at least 8 characters long."
                ));
                return BadRequest(errors);
            }

            if (await _context.UsersSet.AnyAsync(u => u.Email == newUser.Email))
            {
                errors.Add(new ErrorMessage(
                    "Email",
                    "Ez az email cím már foglalt.",
                    "This email address is already taken."
                ));
                return BadRequest(errors);
            }

            newUser.Token = Guid.NewGuid().ToString();
            _context.UsersSet.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
        }

        // POST: api/User/login (Bejelentkezés)
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] Models.LoginRequest loginRequest)
        {
            var errors = new List<ErrorMessage>();


            if (!ModelState.IsValid)
            {
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        errors.Add(new ErrorMessage(
                            state.Key,
                            error.ErrorMessage,
                            GetEnglishMessage(state.Key, error.ErrorMessage)
                        ));
                    }
                }
                return BadRequest(errors);
            }
            var user = await _context.UsersSet
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            if (user == null || user.Password != loginRequest.Password)
            {
                errors.Add(new ErrorMessage(
                    "EmailOrPassword",
                    "Érvénytelen email cím vagy jelszó.",
                    "Invalid email address or password."
                ));
                return BadRequest(errors);
            }

            user.Token = Guid.NewGuid().ToString();
            _context.UsersSet.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { Token = user.Token, UserId = user.Id, Name = user.Name, Role = user.Role });
        }

        // POST: api/User/logout (Kijelentkezés)
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest logoutRequest)
        {
            var errors = new List<ErrorMessage>();


            if (!ModelState.IsValid)
            {
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        errors.Add(new ErrorMessage(
                            state.Key,
                            error.ErrorMessage,
                            GetEnglishMessage(state.Key, error.ErrorMessage)
                        ));
                    }
                }
                return BadRequest(errors);
            }


            var user = await _context.UsersSet
                .FirstOrDefaultAsync(u => u.Token == logoutRequest.Token);

            if (user == null)
            {
                errors.Add(new ErrorMessage(
                    "Token",
                    "Érvénytelen token.",
                    "Invalid token."
                ));
                return BadRequest(errors);
            }
            user.Token = null;
            _context.UsersSet.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { MessageHu = "Sikeres kijelentkezés.", MessageEn = "Successfully logged out." });
        }


        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.UsersSet.FindAsync(id);

            if (user == null)
            {
                return NotFound(); 
            }

            _context.UsersSet.Remove(user); 
            await _context.SaveChangesAsync(); 

            return NoContent();
        }
        private string GetEnglishMessage(string field, string huMessage)
        {
            return field switch
            {
                "Email" when huMessage.Contains("formátum") => "Invalid email address format.",
                "Email" when huMessage.Contains("foglalt") => "This email address is already taken.",
                "Password" => "The password must be at least 8 characters long.",
                "Token" => "The token is required.",
                _ => huMessage switch
                {
                    "Az email megadása kötelező." => "The email is required.",
                    "A jelszó megadása kötelező." => "The password is required.",
                    "A token megadása kötelező." => "The token is required.",
                    _ => "An error occurred."
                }
            };
        }
    }
}
