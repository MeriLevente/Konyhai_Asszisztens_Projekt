using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/items")]
    [ApiController]
    public class ItemsController : Controller
    {
        private readonly DataContext _context;

        public ItemsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Items>>> GetAllItems()
        {
            return await _context.Items.ToListAsync();
        }

        [HttpGet("length")]
        public async Task<ActionResult<DataLength>> GetAllItemsLength()
        {
            var items = await _context.Items.ToListAsync();
            return Ok(new DataLength(items.Count));
        }

        [HttpGet("from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<Items>>> GetItemsPaginated(int from, int to)
        {
            try
            {
                if ((from >= 0 && to >= 0) && from < to && _context.Items.ToList().Count > from)
                {
                    var items = _context.Items.ToList().Skip(from).Take(to-from);
                    return Ok(items);
                }
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("typeid/{id}")]
        public async Task<ActionResult<IEnumerable<Items>>> GetItemsByTypeId(int? id)
        {
            try
            {
                
                if (id == null || !_context.ItemTypes.Any(x=> x.Id == id))
                {
                    return NotFound(new ErrorMessage(Hu: "A termékek nem találhatóak!", En: "Items cannot be found!"));
                }
                return Ok(_context.Items.Where(x => x.TypeId == id).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("search/{searchword}")]
        public async Task<ActionResult<IEnumerable<Items>>> GetItemsBySearchword(string searchword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                return Ok(_context.Items.Where(x => language == "hu" ? x.Name.ToLower().StartsWith(searchword.ToLower()) : x.Name_EN.ToLower().StartsWith(searchword.ToLower())).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("typeid/{id}/search/{searchword}")]
        public async Task<ActionResult<IEnumerable<Items>>> GetItemsByTypeAndSearchword(int? id, string searchword)
        {
            try
            {
                if (id == null || !_context.ItemTypes.Any(x => x.Id == id))
                {
                    return NotFound(new ErrorMessage(Hu: "A termékek nem találhatóak!", En: "Items cannot be found!"));
                }
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                List<Items> items = _context.Items.Where(x => x.TypeId == id).ToList();
                return Ok(items.Where(x => language == "hu" ? x.Name.ToLower().StartsWith(searchword.ToLower()) : x.Name_EN.ToLower().StartsWith(searchword.ToLower())).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<Items>> AddItem([FromBody] Items item)
        {
            try
            {
                if (item != null) // + validálás
                {
                    _context.Items.Add(item);
                    await _context.SaveChangesAsync();
                    return StatusCode(201, item);
                }
                return BadRequest(new ErrorMessage(Hu: "Helytelenün adta meg az adatot!", En: "Incorrect item!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpPut]
        public async Task<ActionResult<Items>> UpdateItem([FromBody] Items newData)
        {
            try
            {
                bool toBeModied = _context.Items.Any(x => x.Id == newData.Id);
                if (toBeModied != false)
                {
                    _context.Items.Entry(newData).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return Ok(newData);
                }
                return BadRequest(new ErrorMessage(Hu: "Nem adott meg semmit!", En: "You haven't uploaded anything!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: $"Hiba történt! {ex.Message}", En: $"An error occured {ex.Message}!"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Items>> DeleteItem(int id)
        {
            try
            {
                Items? toBeDeleted = _context.Items.Where(x => x.Id == id).SingleOrDefault();
                if (toBeDeleted != null)
                {
                    List<Stores> documentsInStores = _context.Stores.Where(x=> x.Id == id).ToList();
                    List<Contains> documentsInContains = _context.Contains.Where(x => x.ItemId == id).ToList();
                    if (documentsInStores.Count == 0 && documentsInContains.Count == 0)
                    {
                        _context.Items.Remove(toBeDeleted);
                        await _context.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    return BadRequest(new ErrorMessage(
                        Hu: $"Nem lehet törölni, mert {documentsInStores.Count + documentsInContains.Count} rekord hivatkozik rá!",
                        En: $"Item can not be deleted, because {documentsInStores.Count + documentsInContains.Count} item refers to it!"
                    ));
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

