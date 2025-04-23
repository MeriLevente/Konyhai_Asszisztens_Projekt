using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KonyhaiAsszisztensBackend.Controllers;
using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Xunit;

namespace KonyhaiAsszisztensBackend.Tests
{
    public class RecipesControllerTests : IDisposable
    {
        private readonly DataContext _context;
        private readonly RecipesController _controller;

        public RecipesControllerTests()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_" + Guid.NewGuid().ToString())
                .Options;
            _context = new DataContext(options);
            _context.Database.EnsureCreated();
            _controller = new RecipesController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetAllRecipes_ReturnsAllRecipes()
        {
            var recipe1 = new Recipes
            {
                Id = 1,
                Name = "Recipe1",
                Name_EN = "Recipe1_EN",
                Description = "Recipe1 description",
                Description_EN = "Recipe1 description EN",
                Type = "Main Course"
            };
            var recipe2 = new Recipes
            {
                Id = 2,
                Name = "Recipe2",
                Name_EN = "Recipe2_EN",
                Description = "Recipe2 description",
                Description_EN = "Recipe2 description EN",
                Type = "Dessert"
            };
            _context.Recipes.AddRange(recipe1, recipe2);
            await _context.SaveChangesAsync();


            var result = await _controller.GetAllRecipes();


            var actionResult = Assert.IsType<ActionResult<IEnumerable<Recipes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var recipes = Assert.IsAssignableFrom<IEnumerable<Recipes>>(okResult.Value).ToList();
            Assert.Equal(2, recipes.Count);
            Assert.All(recipes, r => Assert.NotNull(r.Ingredients));
        }


        [Fact]
        public async Task GetRecipeBySearchLengthReturnsCorrectLength()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _controller.ControllerContext.HttpContext.Request.Headers["Accept-Language"] = "hu";

            var recipe1 = new Recipes
            {
                Id = 1,
                Name = "Pasta",
                Name_EN = "Pasta_EN",
                Description = "Delicious pasta recipe",
                Description_EN = "Delicious pasta recipe EN",
                Type = "Main Course"
            };

            var recipe2 = new Recipes
            {
                Id = 2,
                Name = "Pizza",
                Name_EN = "Pizza_EN",
                Description = "Cheesy pizza recipe",
                Description_EN = "Cheesy pizza recipe EN",
                Type = "Main Course"
            };

            var recipe3 = new Recipes
            {
                Id = 3,
                Name = "Salad",
                Name_EN = "Salad_EN",
                Description = "Fresh salad recipe",
                Description_EN = "Fresh salad recipe EN",
                Type = "Appetizer"
            };

            _context.Recipes.AddRange(recipe1, recipe2, recipe3);
            await _context.SaveChangesAsync();
            var result = await _controller.GetRecipeBySearchLength("p");
            var actionResult = Assert.IsType<ActionResult<DataLength>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dataLength = Assert.IsType<DataLength>(okResult.Value);
            Assert.Equal(2, dataLength.Length);
        }


        [Fact]
        public async Task GetRecipesPaginated_WithValidRange_ReturnsPartialRecipes()
        {
            for (int i = 1; i <= 5; i++)
            {
                _context.Recipes.Add(new Recipes
                {
                    Id = i,
                    Name = $"Recipe{i}",
                    Name_EN = $"Recipe{i}_EN",
                    Description = $"Recipe{i} description",    
                    Description_EN = $"Recipe{i} description EN", 
                    Type = "Main Course"                          
                });
            }
            await _context.SaveChangesAsync();

            var result = await _controller.GetRecipesPaginated(1, 4);

            var actionResult = Assert.IsType<ActionResult<IEnumerable<Recipes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedRecipes = Assert.IsAssignableFrom<IEnumerable<Recipes>>(okResult.Value).ToList();
            Assert.Equal(3, returnedRecipes.Count);
        }


        [Fact]
        public async Task GetRecipesPaginated_WithInvalidRange_ReturnsBadRequest()
        {
            _context.Recipes.Add(new Recipes
            {
                Id = 1,
                Name = "Recipe1",
                Name_EN = "Recipe1_EN",
                Description = "Test description",
                Description_EN = "Test description EN",
                Type = "Test Type"
            });
            await _context.SaveChangesAsync();

            var result = await _controller.GetRecipesPaginated(1, 0);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Recipes>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Contains("Hibás tól vagy ig szám", error.hu);
        }


        [Fact]
        public async Task GetRecipeBySearch_ReturnsMatchingRecipes()
        {

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _controller.ControllerContext.HttpContext.Request.Headers["Accept-Language"] = "hu";

            var recipe1 = new Recipes
            {
                Id = 1,
                Name = "Pasta",
                Name_EN = "Pasta_EN",
                Description = "Delicious pasta recipe",      
                Description_EN = "Delicious pasta recipe EN",   
                Type = "Main Course"                              
            };

            var recipe2 = new Recipes
            {
                Id = 2,
                Name = "Pizza",
                Name_EN = "Pizza_EN",
                Description = "Cheesy pizza recipe",          
                Description_EN = "Cheesy pizza recipe EN",        
                Type = "Main Course"                              
            };

            var recipe3 = new Recipes
            {
                Id = 3,
                Name = "Salad",
                Name_EN = "Salad_EN",
                Description = "Fresh salad recipe",            
                Description_EN = "Fresh salad recipe EN",         
                Type = "Starter"                              
            };

            _context.Recipes.AddRange(recipe1, recipe2, recipe3);
            await _context.SaveChangesAsync();
            var result = await _controller.GetRecipeBySearch("p");
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Recipes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedRecipes = Assert.IsAssignableFrom<IEnumerable<Recipes>>(okResult.Value).ToList();
            Assert.Equal(2, returnedRecipes.Count);
            Assert.All(returnedRecipes, r =>
                Assert.Contains("p", r.Name.ToLower())
            );
        }
    }
}
