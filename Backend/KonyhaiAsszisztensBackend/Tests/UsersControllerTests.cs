using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using KonyhaiAsszisztensBackend.Controllers;
using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using BCrypt.Net;
using Models;

namespace KonyhaiAsszisztensBackend.Tests
{
    public class UserControllerTests : IDisposable
    {
        private readonly DataContext _context;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new DataContext(options);
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
            _controller = new UserController(_context);
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
            };
        }
        [Fact]
        public async Task GetUser_ReturnsUser_WhenUserExists()
        {
            var user = new Users { Id = 1, Name = "User1", Email = "user1@test.com", Password = "pass", Role = "user", Token = "token1" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var result = await _controller.GetUser(1);
            var actionResult = Assert.IsType<ActionResult<Users>>(result);
            var returnedUser = actionResult.Value;
            Assert.NotNull(returnedUser);
            Assert.Equal(1, returnedUser.Id);
            Assert.Equal("User1", returnedUser.Name);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            var result = await _controller.GetUser(99);
            var actionResult = Assert.IsType<ActionResult<Users>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task RegisterUser_CreatesNewUser_ReturnsCreated()
        {
            var newUser = new Users { Name = "NewUser", Email = "newuser@test.com", Password = "password123" };
            var result = await _controller.RegisterUser(newUser);
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdUser = Assert.IsType<Users>(createdResult.Value);
            Assert.Equal("NewUser", createdUser.Name);
            Assert.Equal("user", createdUser.Role);
            Assert.NotEqual("password123", createdUser.Password);
            Assert.False(string.IsNullOrWhiteSpace(createdUser.Token));
        }
        [Fact]
        public async Task RegisterUser_ReturnsBadRequest_WhenUserExists()
        {
            var existingUser = new Users { Id = 1, Name = "Existing", Email = "exist@test.com", Password = BCrypt.Net.BCrypt.HashPassword("pass") };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();
            var newUser = new Users { Name = "NewUser", Email = "exist@test.com", Password = "password123" };
            var result = await _controller.RegisterUser(newUser);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Equal("User already exist!", error.en);
        }
        [Fact]
        public async Task RegisterAdmin_CreatesNewAdmin_ReturnsCreated()
        {
            var newAdmin = new Users { Name = "NewAdmin", Email = "admin@test.com", Password = "adminpass" };
            var result = await _controller.RegisterAdmin(newAdmin);
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdUser = Assert.IsType<Users>(createdResult.Value);
            Assert.Equal("NewAdmin", createdUser.Name);
            Assert.Equal("admin", createdUser.Role);
            Assert.NotEqual("adminpass", createdUser.Password);
        }
        [Fact]
        public async Task Login_ReturnsUser_WhenCredentialsCorrect()
        {
            var plainPassword = "mysecret";
            var hashed = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            var user = new Users { Id = 1, Name = "UserLogin", Email = "login@test.com", Password = hashed, Role = "user", Token = "" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var loginData = new Users { Email = "login@test.com", Password = plainPassword };
            var result = await _controller.Login(loginData);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedUser = Assert.IsType<Users>(okResult.Value);
            Assert.Equal(1, returnedUser.Id);
            Assert.False(string.IsNullOrWhiteSpace(returnedUser.Token));
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenCredentialsIncorrect()
        {
            var plainPassword = "mysecret";
            var hashed = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            var user = new Users { Id = 1, Name = "UserLogin", Email = "login@test.com", Password = hashed, Role = "user", Token = "" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var loginData = new Users { Email = "login@test.com", Password = "wrongpass" };
            var result = await _controller.Login(loginData);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Equal("Incorrect email or password!", error.en);
        }

        [Fact]
        public async Task Logout_ReturnsOk_WhenUserExists()
        {
            var user = new Users { Id = 1, Name = "UserLogout", Email = "logout@test.com", Password = "dummy", Role = "user", Token = "sometoken" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var result = await _controller.Logout(1);
            Assert.IsType<OkResult>(result);
            var updatedUser = await _context.Users.FindAsync(1);
            Assert.Equal("", updatedUser.Token);
        }
        [Fact]
        public async Task Logout_ReturnsBadRequest_WhenUserNotFound()
        {
            var result = await _controller.Logout(99);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Equal("Logout failed!", error.en);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
