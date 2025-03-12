using KonyhaiAsszisztensBackend.Data;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!IsValidEmail(newUser.Email))
            {
                ModelState.AddModelError("Email", "Érvénytelen email cím formátum.");
                return BadRequest(ModelState);
            }

            if (await _context.UsersSet.AnyAsync(u => u.Email == newUser.Email))
            {
                ModelState.AddModelError("Email", "Ez az email cím már foglalt.");
                return BadRequest(ModelState);
            }

            if (newUser.Password.Length < 8)
            {
                ModelState.AddModelError("Password", "A jelszónak legalább 8 karakter hosszúnak kell lennie.");
                return BadRequest(ModelState);
            }

            var validRoles = new[] { "admin", "user" };
            if (!validRoles.Contains(newUser.Role.ToLower()))
            {
                ModelState.AddModelError("Role", "Érvénytelen szerepkör. Csak 'admin' vagy 'user' engedélyezett.");
                return BadRequest(ModelState);
            }

            newUser.Token = Guid.NewGuid().ToString();
            _context.UsersSet.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
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
    }
}
