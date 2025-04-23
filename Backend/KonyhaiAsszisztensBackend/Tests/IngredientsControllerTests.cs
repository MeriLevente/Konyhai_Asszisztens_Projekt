using KonyhaiAsszisztensBackend.Controllers;
using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace KonyhaiAsszisztensBackend.Tests
{
    public class IngredientsControllerTests
    {
        private readonly Mock<DataContext> _mockContext;
        private readonly IngredientsController _controller;

        public IngredientsControllerTests()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _controller = new IngredientsController(_mockContext.Object);
        }

        [Fact]
        public async Task GetItemsByRecipeId_ReturnsOkResult_WithIngredients()
        {
            int recipeId = 1;
            var ingredients = new List<Contains>
                {
                    new Contains { RecipeId = recipeId, ItemId = 1, Quantity = 100, Item = new Items { Id = 1, Name = "Sugar" } }
                };
            var mockDbSet = new Mock<DbSet<Contains>>();
            mockDbSet.ReturnsDbSet(ingredients);
            _mockContext.Setup(c => c.Contains).Returns(mockDbSet.Object);
            var result = await _controller.GetItemsByRecipeId(recipeId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Contains>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task StoreItemInStorage_ReturnsCreatedResult_WhenNewItem()
        {
            var ingredient = new Contains { RecipeId = 1, ItemId = 1, Quantity = 100 };
            var items = new List<Items> { new Items { Id = 1, Name = "Sugar" } };
            var recipes = new List<Recipes> { new Recipes { Id = 1, Name = "Cake" } };
            var mockItemsDbSet = new Mock<DbSet<Items>>();
            var mockRecipesDbSet = new Mock<DbSet<Recipes>>();
            var mockContainsDbSet = new Mock<DbSet<Contains>>();
            mockItemsDbSet.ReturnsDbSet(items);
            mockRecipesDbSet.ReturnsDbSet(recipes);
            mockContainsDbSet.ReturnsDbSet(new List<Contains>());
            _mockContext.Setup(c => c.Items).Returns(mockItemsDbSet.Object);
            _mockContext.Setup(c => c.Recipes).Returns(mockRecipesDbSet.Object);
            _mockContext.Setup(c => c.Contains).Returns(mockContainsDbSet.Object);
            var result = await _controller.StoreItemInStorage(ingredient);
            var createdResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);
        }

        [Fact]
        public async Task StoreItemInStorage_ReturnsBadRequest_WhenInvalidQuantity()
        {
            var ingredient = new Contains { RecipeId = 1, ItemId = 1, Quantity = -1 };
            var result = await _controller.StoreItemInStorage(ingredient);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessage = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Equal("Incorrect quantity!", errorMessage.en);
        }

        [Fact]
        public async Task ClearAllIngredientsFromRecipe_ReturnsNoContent()
        {
            int recipeId = 1;
            var ingredients = new List<Contains>
                {
                    new Contains { RecipeId = recipeId, ItemId = 1, Quantity = 100 }
                };
            var mockDbSet = new Mock<DbSet<Contains>>();
            mockDbSet.ReturnsDbSet(ingredients);
            _mockContext.Setup(c => c.Contains).Returns(mockDbSet.Object);
            var result = await _controller.ClearAllIngredientsFromRecipe(recipeId);
            var noContentResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(204, noContentResult.StatusCode);
        }
    }

    public static class DbSetMockingExtensions
    {
        public static DbSet<T> ReturnsDbSet<T>(this Mock<DbSet<T>> dbSetMock, IEnumerable<T> sourceList) where T : class
        {
            var queryable = sourceList.AsQueryable();
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
            return dbSetMock.Object;
        }
    }
}
