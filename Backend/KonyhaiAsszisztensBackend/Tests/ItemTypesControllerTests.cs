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
    public class ItemTypesControllerTests : IDisposable
    {
        private readonly DataContext _context;
        private readonly ItemTypesController _controller;

        public ItemTypesControllerTests()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_" + Guid.NewGuid().ToString())
                .Options;
            _context = new DataContext(options);
            _context.Database.EnsureDeleted(); 
            _context.Database.EnsureCreated();

            _controller = new ItemTypesController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }


        [Fact]
        public async Task GetAllItemTypes_ReturnsAllTypes()
        {
            _context.ItemTypes.RemoveRange(_context.ItemTypes);
            await _context.SaveChangesAsync();

            var type1 = new ItemTypes
            {
                Name = "Type1",
                Name_EN = "Type1_EN",
                Image = "dummy.png" 
            };

            var type2 = new ItemTypes
            {
                Name = "Type2",
                Name_EN = "Type2_EN",
                Image = "dummy.png" 
            };

            _context.ItemTypes.Add(type1);
            _context.ItemTypes.Add(type2);
            await _context.SaveChangesAsync();
            var result = await _controller.GetAllItemTypes();
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var types = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(actionResult.Value)?.ToList();
            Assert.Equal(2, types.Count);
        }


        [Fact]
        public async Task GetTypesPaginated_ReturnsPaginatedTypes()
        {
            for (int i = 1; i <= 5; i++)
            {
                _context.ItemTypes.Add(new ItemTypes
                {
                    Id = i,
                    Name = $"Type{i}",
                    Name_EN = $"Type{i}_EN",
                    Image = "dummy.png"
                });
            }
            await _context.SaveChangesAsync();
            var result = await _controller.GetTypesPaginated(1, 4);
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var types = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(okResult.Value)?.ToList();
            Assert.NotNull(types);
            Assert.Equal(3, types.Count);
            Assert.Equal(2, types.First().Id);
        }



        [Fact]
        public async Task AddType_NullType_ReturnsBadRequest()
        {
            _controller.ModelState.Clear();
            var actionResult = await _controller.AddType(null);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorMessage = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Equal("Incorrect type!", errorMessage.en);
        }


        [Fact]
        public async Task UpdateType_UpdatesExistingType_ReturnsUpdatedType()
        {
            _context.ItemTypes.RemoveRange(_context.ItemTypes);
            await _context.SaveChangesAsync();
            var originalType = new ItemTypes
            {
                Name = "OriginalType",
                Name_EN = "OriginalType_EN",
                Image = "original.png"
            };

            _context.ItemTypes.Add(originalType);
            await _context.SaveChangesAsync();
            var id = originalType.Id;
            _context.Entry(originalType).State = EntityState.Detached;
            var updatedType = new ItemTypes
            {
                Id = id,
                Name = "UpdatedType",
                Name_EN = "UpdatedType_EN",
                Image = "updated.png"
            };
            _controller.ModelState.Clear();
            var result = await _controller.UpdateType(updatedType);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var typeFromResponse = Assert.IsType<ItemTypes>(okResult.Value);
            Assert.Equal("UpdatedType", typeFromResponse.Name);
            Assert.Equal("UpdatedType_EN", typeFromResponse.Name_EN);
            Assert.Equal("updated.png", typeFromResponse.Image);
        }



        [Fact]
        public async Task DeleteType_DeletesExistingType_ReturnsNoContent()
        {
            var typeToDelete = new ItemTypes
            {
                Id = 1,
                Name = "DeleteType",
                Name_EN = "DeleteType_EN",
                Image = "dummy.png"
            };
            _context.ItemTypes.Add(typeToDelete);
            await _context.SaveChangesAsync();
            var result = await _controller.DeleteType(1);
            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var statusCodeResult = Assert.IsType<StatusCodeResult>(actionResult.Result);
            Assert.Equal(204, statusCodeResult.StatusCode);
            var dbType = await _context.ItemTypes.FindAsync(1);
            Assert.Null(dbType);
        }


        [Fact]
        public async Task DeleteType_FailsWhenTypeHasReferencedItems_ReturnsBadRequest()
        {
            var typeReferenced = new ItemTypes
            {
                Id = 1,
                Name = "ReferencedType",
                Name_EN = "ReferencedType_EN",
                Image = "dummy.png"
            };
            _context.ItemTypes.Add(typeReferenced);

            _context.Items.Add(new Items
            {
                Id = 1,
                Name = "Item1",
                Name_EN = "Item1_EN",
                TypeId = 1
            });
            await _context.SaveChangesAsync();

            var result = await _controller.DeleteType(1);

            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Contains("rekord hivatkozik rá", error.hu);
        }

    }
}
