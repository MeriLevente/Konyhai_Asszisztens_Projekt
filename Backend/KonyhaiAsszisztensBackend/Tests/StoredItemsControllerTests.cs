using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using KonyhaiAsszisztensBackend.Controllers;
using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Models;

namespace KonyhaiAsszisztensBackend.Tests
{
    public class StoredItemsControllerTests : IDisposable
    {
        private readonly DataContext _context;
        private readonly StoredItemsController _controller;

        public StoredItemsControllerTests()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new DataContext(options);
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _controller = new StoredItemsController(_context);
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
            };
        }
        [Fact]
        public async Task GetItemsByUserId_ReturnsCorrectItems()
        {
            var item = new Items { Id = 1, Name = "TestItem", Name_EN = "TestItem_EN", TypeId = 1 };
            _context.Items.Add(item);
            _context.Stores.Add(new Stores { Id = 1, UserId = 1, ItemId = 1, Quantity = 10, StoredItem = item });
            _context.Stores.Add(new Stores { Id = 2, UserId = 1, ItemId = 1, Quantity = 20, StoredItem = item });
            _context.Stores.Add(new Stores { Id = 3, UserId = 2, ItemId = 1, Quantity = 30, StoredItem = item });
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsByUserId(1);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Stores>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var stores = Assert.IsAssignableFrom<IEnumerable<Stores>>(okResult.Value)?.ToList();
            Assert.Equal(2, stores.Count);
        }
        [Fact]
        public async Task GetItemsByUserIdLength_ReturnsCorrectLength()
        {
            var item = new Items { Id = 2, Name = "TestItem2", Name_EN = "TestItem2_EN", TypeId = 1 };
            _context.Items.Add(item);
            _context.Stores.Add(new Stores { Id = 10, UserId = 1, ItemId = 2, Quantity = 5, StoredItem = item });
            _context.Stores.Add(new Stores { Id = 11, UserId = 1, ItemId = 2, Quantity = 15, StoredItem = item });
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsByUserIdLength(1);
            var actionResult = Assert.IsType<ActionResult<DataLength>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dataLength = Assert.IsType<DataLength>(okResult.Value);
            Assert.Equal(2, dataLength.Length);
        }

        [Fact]
        public async Task GetItemsPaginated_ReturnsPaginatedItems()
        { 
            var item = new Items { Id = 3, Name = "TestItem3", Name_EN = "TestItem3_EN", TypeId = 1 };
            _context.Items.Add(item);
            for (int i = 1; i <= 5; i++)
            {
                _context.Stores.Add(new Stores
                {
                    Id = 20 + i,
                    UserId = 1,
                    ItemId = 3,
                    Quantity = 10 * i,
                    StoredItem = item
                });
            }
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsPaginated(1, 1, 4);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Stores>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var paginatedStores = Assert.IsAssignableFrom<IEnumerable<Stores>>(okResult.Value)?.ToList();
            Assert.Equal(3, paginatedStores.Count);
        }

        [Fact]
        public async Task GetItemsByTypeId_ReturnsFilteredItems()
        {
            var item1 = new Items { Id = 4, Name = "A", Name_EN = "A_EN", TypeId = 1 };
            var item2 = new Items { Id = 5, Name = "B", Name_EN = "B_EN", TypeId = 2 };
            _context.Items.AddRange(item1, item2);
            _context.Stores.Add(new Stores { Id = 30, UserId = 1, ItemId = 4, Quantity = 10, StoredItem = item1 });
            _context.Stores.Add(new Stores { Id = 31, UserId = 1, ItemId = 5, Quantity = 20, StoredItem = item2 });
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsByTypeId(1, 1);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Stores>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var filteredStores = Assert.IsAssignableFrom<IEnumerable<Stores>>(okResult.Value)?.ToList();
            Assert.Single(filteredStores);
            Assert.Equal(1, filteredStores.First().StoredItem.TypeId);
        }
        [Fact]
        public async Task GetItemsByTypeIdLength_ReturnsCorrectLength()
        {
            var item = new Items { Id = 6, Name = "X", Name_EN = "X_EN", TypeId = 1 };
            _context.Items.Add(item);
            _context.Stores.Add(new Stores { Id = 40, UserId = 1, ItemId = 6, Quantity = 5, StoredItem = item });
            _context.Stores.Add(new Stores { Id = 41, UserId = 1, ItemId = 6, Quantity = 15, StoredItem = item });
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsByTypeIdLength(1, 1);
            var actionResult = Assert.IsType<ActionResult<DataLength>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var lengthData = Assert.IsType<DataLength>(okResult.Value);
            Assert.Equal(2, lengthData.Length);
        }
        [Fact]
        public async Task GetItemsByTypeIdPaginated_ReturnsPaginatedFilteredItems()
        {
            var item = new Items { Id = 7, Name = "Y", Name_EN = "Y_EN", TypeId = 1 };
            _context.Items.Add(item);
            for (int i = 1; i <= 4; i++)
            {
                _context.Stores.Add(new Stores
                {
                    Id = 50 + i,
                    UserId = 1,
                    ItemId = 7,
                    Quantity = i * 5,
                    StoredItem = item
                });
            }
            await _context.SaveChangesAsync();
            var result = await _controller.GetItemsByTypeIdPaginated(1, 1, 1, 3);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Stores>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var paginatedFilteredStores = Assert.IsAssignableFrom<IEnumerable<Stores>>(okResult.Value)?.ToList();
            Assert.Equal(2, paginatedFilteredStores.Count);
        }
        [Fact]
        public async Task GetItemsBySearchedWord_ReturnsMatchingItems()
        {
            var itemA = new Items { Id = 8, Name = "Apple", Name_EN = "Apple_EN", TypeId = 1 };
            var itemB = new Items { Id = 9, Name = "Banana", Name_EN = "Banana_EN", TypeId = 1 };
            _context.Items.AddRange(itemA, itemB);
            _context.Stores.Add(new Stores { Id = 60, UserId = 1, ItemId = 8, Quantity = 10, StoredItem = itemA });
            _context.Stores.Add(new Stores { Id = 61, UserId = 1, ItemId = 9, Quantity = 20, StoredItem = itemB });
            await _context.SaveChangesAsync();
            _controller.Request.Headers["Accept-Language"] = "hu";
            var result = await _controller.GetItemsBySearchedWord(1, "Ap");
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Stores>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var matchingStores = Assert.IsAssignableFrom<IEnumerable<Stores>>(okResult.Value)?.ToList();
            Assert.Single(matchingStores);
            Assert.Equal("Apple", matchingStores.First().StoredItem.Name);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}

