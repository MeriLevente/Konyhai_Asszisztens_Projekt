using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using KonyhaiAsszisztensBackend.Data;
using Models;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/types")]
    [ApiController]
    public class ItemTypesController : Controller
    {
        private readonly DataContext _context;

        public ItemTypesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemTypes>>> GetAllItemTypes()
        {
            return await _context.ItemTypes.ToListAsync();
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("length")]
        public async Task<ActionResult<DataLength>> GetAllItemTypesLength()
        {
            var types = _context.ItemTypes.ToList();
            return Ok(new DataLength(types.Count));
        }

        [HttpGet("from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<ItemTypes>>> GetTypesPaginated(int from, int to)
        {
            try
            {
                if ((from >= 0 && to >= 0) && from < to && _context.ItemTypes.ToList().Count > from)
                {
                    return Ok(_context.ItemTypes.ToList().Skip(from).Take(to - from));
                }
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("search/{searchedword}")]
        public async Task<ActionResult<IEnumerable<ItemTypes>>> GetTypesBySearch(string searchedword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                var types = _context.ItemTypes.Where(x => language == "hu" ? x.Name.ToLower().StartsWith(searchedword.ToLower()) : x.Name_EN.ToLower().StartsWith(searchedword.ToLower())).ToList();
                return Ok(types);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ItemTypes>> AddType([FromBody] ItemTypes type)
        {
            try
            {
                if (type != null)
                {
                    _context.ItemTypes.Add(type);
                    await _context.SaveChangesAsync();
                    return StatusCode(201, type);
                }
                return BadRequest(new ErrorMessage(Hu: "Helytelenün adta meg a típust!", En: "Incorrect type!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpPut]
        public async Task<ActionResult<ItemTypes>> UpdateType([FromBody] ItemTypes newData)
        {
            try
            {
                bool typeToBeModied = _context.ItemTypes.Any(x=> x.Id == newData.Id);
                if (typeToBeModied != false)
                {
                    _context.ItemTypes.Entry(newData).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return Ok(newData);
                }
                return BadRequest(new ErrorMessage(Hu: "A módosítandó típus nem található!", En: "The type to be updated can not be found!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: $"Hiba történt! {ex.Message}", En: $"An error occured {ex.Message}!"));
            }
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult<ItemTypes>> DeleteType(int id)
        {
            try
            {
                ItemTypes? typeToBeDeleted = _context.ItemTypes.Where(x=> x.Id==id).SingleOrDefault();     
                if (typeToBeDeleted != null)
                {
                    List<Items> items = _context.Items.Where(x => x.TypeId == id).ToList();
                    if(items.Count == 0)
                    {
                        _context.ItemTypes.Remove(typeToBeDeleted);
                        await _context.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    return BadRequest(new ErrorMessage(Hu: $"Típust nem lehet törölni, mert {items.Count} rekord hivatkozik rá!", En: $"Type can not be deleted, because {items.Count} item refers to it!"));
                }
                return BadRequest(new ErrorMessage(Hu: $"Id ({id}) nem található a típusok táblában!", En: $"Id ({id}) cannot be found in types table!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }
    }
}
