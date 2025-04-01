using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Models;
using System.Text.Json;
using BCrypt.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        public UserController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        [Microsoft.AspNetCore.Mvc.Route("register")]
        public async Task<ActionResult<Users>> RegisterUser(Users newUser)
        {
            try
            {
                if (_context.Users.Select(x => x.Email).Contains(newUser.Email) == false)
                {
                    newUser.Role = "user";
                    var passwordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
                    newUser.Password = passwordHash;
                    newUser.Token = Guid.NewGuid().ToString();
                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
                }
                else
                {
                    return BadRequest(new ErrorMessage(Hu: "Ilyen felhasználó már létezik!", En: "User already exist!"));
                }
            } catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            } 
        }

        [Authorize]
        [HttpPost]
        [Microsoft.AspNetCore.Mvc.Route("registeradmin")]
        public async Task<ActionResult<Users>> RegisterAdmin(Users newUser)
        {
            try
            {
                if (_context.Users.Select(x => x.Email).Contains(newUser.Email) == false)
                {
                    newUser.Role = "admin";
                    var passwordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
                    newUser.Password = passwordHash;
                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
                }
                else
                {
                    return BadRequest(new ErrorMessage(Hu: "Ilyen felhasználó már létezik!", En: "User already exist!"));
                }
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }


        [HttpPut]
        [Microsoft.AspNetCore.Mvc.Route("login")]
        public async Task<ActionResult<Users>> Login([FromBody] Users data)
        {
            try
            {
                Users? user = _context.Users.Where(x => x.Email == data.Email).SingleOrDefault();
                if (user != null && BCrypt.Net.BCrypt.Verify(data.Password, user!.Password))
                {
                    if(user.Token == "")
                    {
                        user.Token = Guid.NewGuid().ToString();
                    }
                   _context.Users.Update(user);
                   await _context.SaveChangesAsync();
                   return Ok(user);
                } else
                {
                    return BadRequest(new ErrorMessage(Hu: "Hibás email vagy jelszó!", En: "Incorrect email or password!"));
                }
            }
            catch (Exception ex) {
                return BadRequest(new ErrorMessage(Hu: "Hibás email vagy jelszó!", En: "Incorrect email or password!"));
            }
        }

        [Authorize]
        [HttpPut]
        [Microsoft.AspNetCore.Mvc.Route("logout/{id}")]
        public async Task<ActionResult> Logout(int id)
        {
            try
            {
                Users? user = _context.Users.Where(x=> x.Id == id).SingleOrDefault();
                if (user != null)
                {
                    user.Token = "";
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest(new ErrorMessage(Hu: "Kijelentkezés sikertelen!", En: "Logout failed!"));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: $"Hiba történt!\n{ex}", En: $"An error occured!\n{ex}"));
            }
        }
    }
}
