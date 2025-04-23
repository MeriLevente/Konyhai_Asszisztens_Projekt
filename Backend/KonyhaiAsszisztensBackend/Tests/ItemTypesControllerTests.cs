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
            // Egyedi InMemory adatbázis minden teszt futtatásához, így nem maradnak adatmaradványok.
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_" + Guid.NewGuid().ToString())
                .Options;
            _context = new DataContext(options);
            _context.Database.EnsureCreated();

            _controller = new ItemTypesController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetAllItemTypesReturnsAllTypes()
        {
            // Arrange: feltöltünk két típust
            _context.ItemTypes.Add(new ItemTypes { Id = 1, Name = "Type1", Name_EN = "Type1_EN" });
            _context.ItemTypes.Add(new ItemTypes { Id = 2, Name = "Type2", Name_EN = "Type2_EN" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAllItemTypes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var types = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(actionResult.Value)?.ToList();
            Assert.NotNull(types);
            Assert.Equal(2, types.Count);
        }

        [Fact]
        public async Task GetAllItemTypes_ReturnsAllTypes()
        {
            // Arrange: feltöltünk két típust, minden kötelező mezővel, így az Image mezővel is
            _context.ItemTypes.Add(new ItemTypes
            {
                Id = 1,
                Name = "Type1",
                Name_EN = "Type1_EN",
                Image = "dummy.png" // Kötelező property értéke
            });
            _context.ItemTypes.Add(new ItemTypes
            {
                Id = 2,
                Name = "Type2",
                Name_EN = "Type2_EN",
                Image = "dummy.png" // Kötelező property értéke
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAllItemTypes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var types = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(actionResult.Value)?.ToList();
            Assert.Equal(2, types.Count);
        }


        [Fact]
        public async Task GetTypesPaginated_ReturnsPaginatedTypes()
        {
            // Arrange: öt típus beszúrása
            for (int i = 1; i <= 5; i++)
            {
                _context.ItemTypes.Add(new ItemTypes { Id = i, Name = $"Type{i}", Name_EN = $"Type{i}_EN" });
            }
            await _context.SaveChangesAsync();

            // Act:
            // Például ha from=1, to=4, akkor a 2., 3. és 4. elemet várjuk el (összesen 3 típus)
            var result = await _controller.GetTypesPaginated(1, 4);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var types = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(okResult.Value)?.ToList();
            Assert.NotNull(types);
            Assert.Equal(3, types.Count);
            Assert.Equal(2, types.First().Id);
        }

        [Fact]
        public async Task GetTypesBySearch_ReturnsMatchingTypes()
        {
            // Arrange: beállítjuk a ControllerContext-et, hogy elérhető legyen az Accept-Language fejléc
            _controller.ControllerContext = new ControllerContext();
            _controller.ControllerContext.HttpContext = new DefaultHttpContext();
            _controller.ControllerContext.HttpContext.Request.Headers["Accept-Language"] = "hu";

            _context.ItemTypes.Add(new ItemTypes { Id = 1, Name = "Alma", Name_EN = "Apple" });
            _context.ItemTypes.Add(new ItemTypes { Id = 2, Name = "Banán", Name_EN = "Banana" });
            await _context.SaveChangesAsync();

            // Act: a "Al" keresési kifejezésre csak az "Alma" tipus jön vissza
            var result = await _controller.GetTypesBySearch("Al");

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ItemTypes>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var matchingTypes = Assert.IsAssignableFrom<IEnumerable<ItemTypes>>(okResult.Value)?.ToList();
            Assert.NotNull(matchingTypes);
            Assert.Single(matchingTypes);
            Assert.Equal("Alma", matchingTypes.First().Name);
        }

        [Fact]
        public async Task AddType_AddsNewType_ReturnsCreatedType()
        {
            // Arrange
            var newType = new ItemTypes
            {
                Name = "NewType",
                Name_EN = "NewType_EN"
                // Ha az ItemTypes modellben van egyéb kötelező property, azt is állítsd be!
            };

            // Győződj meg róla, hogy a ModelState „tiszta” és érvényes
            _controller.ModelState.Clear();

            // Act
            var result = await _controller.AddType(newType);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var objectResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedType = Assert.IsType<ItemTypes>(objectResult.Value);
            Assert.Equal("NewType", returnedType.Name);

            // Ellenőrizzük, hogy az új típus bekerült az adatbázisba
            var dbType = await _context.ItemTypes.FindAsync(returnedType.Id);
            Assert.NotNull(dbType);
        }

        [Fact]
        public async Task UpdateType_UpdatesExistingType_ReturnsUpdatedType()
        {
            // Arrange: beszúrunk egy típust a teljes, kötelező mezőkkel
            var typeToUpdate = new ItemTypes
            {
                Id = 1,
                Name = "OldType",
                Name_EN = "OldType_EN",
                Image = "dummy.png" // Kötelező mező megadva
            };
            _context.ItemTypes.Add(typeToUpdate);
            await _context.SaveChangesAsync();

            // Új adatok: megváltoztatjuk a nevet, de megőrizzük az Image-t
            var updatedTypeData = new ItemTypes
            {
                Id = 1,                           
                Name = "UpdatedType",           
                Name_EN = "UpdatedType_EN",       
                Image = "dummy.png"               
            };

            // Act
            var result = await _controller.UpdateType(updatedTypeData);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedType = Assert.IsType<ItemTypes>(okResult.Value);
            Assert.Equal("UpdatedType", returnedType.Name);

            // Ellenőrizzük az adatbázisban is, hogy a módosítás megtörtént-e
            var dbType = await _context.ItemTypes.FindAsync(updatedTypeData.Id);
            Assert.Equal("UpdatedType", dbType.Name);
            Assert.Equal("dummy.png", dbType.Image);
        }


        [Fact]
        public async Task DeleteType_DeletesExistingType_ReturnsNoContent()
        {
            // Arrange: beszúrunk egy típust, amelyre nincs hivatkozás
            var typeToDelete = new ItemTypes
            {
                Id = 1,
                Name = "DeleteType",
                Name_EN = "DeleteType_EN",
                Image = "dummy.png" // Kötelező property
            };
            _context.ItemTypes.Add(typeToDelete);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteType(1);

            // Assert: ellenőrizzük, hogy StatusCode 204-et ad vissza
            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var statusCodeResult = Assert.IsType<StatusCodeResult>(actionResult.Result);
            Assert.Equal(204, statusCodeResult.StatusCode);

            // Ellenőrizzük, hogy az adatbázisból törlődött-e a típus
            var dbType = await _context.ItemTypes.FindAsync(1);
            Assert.Null(dbType);
        }


        [Fact]
        public async Task DeleteType_FailsWhenTypeHasReferencedItems_ReturnsBadRequest()
        {
            // Arrange: hozzunk létre egy típust, amelyre hivatkozik legalább egy Items rekord.
            var typeReferenced = new ItemTypes
            {
                Id = 1,
                Name = "ReferencedType",
                Name_EN = "ReferencedType_EN",
                Image = "dummy.png" // Kötelező property feltöltése!
            };
            _context.ItemTypes.Add(typeReferenced);

            // Beszúrunk egy Items rekordot, melyeknek a TypeId-je megegyezik a fenti típus Id-jával.
            _context.Items.Add(new Items
            {
                Id = 1,
                Name = "Item1",
                Name_EN = "Item1_EN",
                TypeId = 1
                // Győződj meg róla, hogy az Items típus esetén minden kötelező mező kitöltésre kerül (ha van ilyen).
            });
            await _context.SaveChangesAsync();

            // Act: próbáljuk meg törölni a típust.
            var result = await _controller.DeleteType(1);

            // Assert: a törlési kísérletnek BadRequest eredménnyel kell térnie, mivel hivatkozás van rá.
            var actionResult = Assert.IsType<ActionResult<ItemTypes>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var error = Assert.IsType<ErrorMessage>(badRequestResult.Value);
            Assert.Contains("rekord hivatkozik rá", error.hu);
        }

    }
}
