using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KonyhaiAsszisztensBackend.Controllers;
using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Xunit;

namespace KonyhaiAsszisztensBackend.Tests
{
    public class ItemsControllerTests : IDisposable
    {
        private readonly DataContext _context;
        private readonly ItemsController _controller;

        public ItemsControllerTests()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_" + Guid.NewGuid().ToString())
                .Options;
            _context = new DataContext(options);
            _context.Database.EnsureCreated();

            _controller = new ItemsController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task AddItem_AddsNewItem_ReturnsCreatedItem()
        {
            var newItem = new Items
            {
                Name = "Test Item",
                Name_EN = "Test Item EN",
                TypeId = 1
            };

            var result = await _controller.AddItem(newItem);

            var actionResult = Assert.IsType<ActionResult<Items>>(result);
            var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
            Assert.Equal(201, objectResult.StatusCode);

            var returnedItem = Assert.IsType<Items>(objectResult.Value);
            Assert.Equal("Test Item", returnedItem.Name);

            var dbItem = await _context.Items.FindAsync(returnedItem.Id);
            Assert.NotNull(dbItem);
        }

        [Fact]
        public async Task GetAllItems_ReturnsAllItems()
        {
            _context.Items.Add(new Items { Name = "Item1", Name_EN = "Item1_EN", TypeId = 1 });
            _context.Items.Add(new Items { Name = "Item2", Name_EN = "Item2_EN", TypeId = 1 });
            await _context.SaveChangesAsync();
            var result = await _controller.GetAllItems();
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Items>>>(result);
            var items = Assert.IsAssignableFrom<IEnumerable<Items>>(actionResult.Value).ToList();
            Assert.Equal(2, items.Count);
        }




        [Fact]
        public async Task GetItemsPaginated_ReturnsPaginatedItems()
        {

            _context.Items.Add(new Items { Name = "Item1", Name_EN = "Item1_EN", TypeId = 1 });
            _context.Items.Add(new Items { Name = "Item2", Name_EN = "Item2_EN", TypeId = 1 });
            _context.Items.Add(new Items { Name = "Item3", Name_EN = "Item3_EN", TypeId = 1 });
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsPaginated(0, 2);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Items>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var items = Assert.IsAssignableFrom<IEnumerable<Items>>(okResult.Value).ToList();
            Assert.Equal(2, items.Count);
        }
    }
}
