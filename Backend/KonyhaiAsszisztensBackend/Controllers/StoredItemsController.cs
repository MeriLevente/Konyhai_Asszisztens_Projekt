using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/storage")]
    [ApiController]
    public class StoredItemsController : Controller
    {
        private readonly DataContext _context;
        public StoredItemsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{userid}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsByUserId(int userid)
        {
            try
            {
                var storedItems = _context.Stores.Where(x => x.UserId == userid).Include(x => x.StoredItem).ToList();
                return Ok(storedItems);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/length")]
        public async Task<ActionResult<DataLength>> GetItemsByUserIdLength(int userid)
        {
            try
            {
                var storedItems = _context.Stores.Where(x => x.UserId == userid).Include(x => x.StoredItem).ToList();
                return Ok(new DataLength(storedItems.Count));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{userid}/from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsPaginated(int userid, int from, int to)
        {
            try
            {
                if((from >= 0 && to >= 0) && from < to)
                {
                    var storedItems = _context.Stores.Where(x => x.UserId == userid).Skip(from).Take(to - from).Include(x => x.StoredItem).ToList();
                    return Ok(storedItems);
                }
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/{typeid}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsByTypeId(int userid, int typeid)
        {
            try
            {
                var storedItems = _context.Stores.Where(x => x.UserId == userid && x.StoredItem.TypeId == typeid).Include(x => x.StoredItem).ToList();
                return Ok(storedItems);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/{typeid}/length")]
        public async Task<ActionResult<DataLength>> GetItemsByTypeIdLength(int userid, int typeid)
        {
            var storedItems = _context.Stores.Where(x => x.UserId == userid && x.StoredItem.TypeId == typeid).Include(x => x.StoredItem).ToList();
            return Ok(new DataLength(storedItems.Count));
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/{typeid}/from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsByTypeIdPaginated(int userid, int typeid, int from, int to)
        {
            try
            {
                if ((from >= 0 && to >= 0) && from < to)
                {
                    var storedItems = _context.Stores.Where(x => x.UserId == userid && x.StoredItem.TypeId == typeid).Skip(from).Take(to - from).Include(x => x.StoredItem).ToList();
                    return Ok(storedItems);
                }      
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/search/{searchedword}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsBySearchedWord(int userid, string searchedword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                var storedItems = _context.Stores
                    .Include(x => x.StoredItem)
                    .Where(x => language == "hu" ? x.StoredItem.Name.ToLower().StartsWith(searchedword.ToLower()) : x.StoredItem.Name_EN.ToLower().StartsWith(searchedword.ToLower()) && userid == x.UserId)
                    .ToList();
                return Ok(storedItems);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("{userid}/{typeid}/search/{searchedword}")]
        public async Task<ActionResult<IEnumerable<Stores>>> GetItemsBySearchedWordAndType(int userid, int typeid, string searchedword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                var storedItems = _context.Stores
                    .Include(x => x.StoredItem)
                    .Where(x => language == "hu" ? x.StoredItem.Name.ToLower().StartsWith(searchedword.ToLower()) : x.StoredItem.Name_EN.ToLower().StartsWith(searchedword.ToLower()) && x.UserId == userid && x.StoredItem.TypeId == typeid)
                    .ToList();
                return Ok(storedItems);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Stores>> StoreItemInStorage([FromBody] Stores storeItem)
        {
            try
            {
                if (storeItem.Quantity.ToString() != "" && storeItem.Quantity > 0 && storeItem.Quantity <= 10000)
                {
                    bool userExists = _context.Users.Any(x => x.Id == storeItem.UserId);
                    if (userExists)
                    {
                        var item = _context.Items.Where(x => x.Id == storeItem.ItemId).FirstOrDefault();
                        if (item != null)
                        {
                            Stores? inStoreItem = _context.Stores.Where(x => x.UserId == storeItem.UserId && x.ItemId == storeItem.ItemId).FirstOrDefault();
                            storeItem.StoredItem = item;
                            if(inStoreItem == null)
                            {
                                _context.Stores.Add(storeItem);
                                await _context.SaveChangesAsync();
                                return StatusCode(201, storeItem);
                            }
                            inStoreItem.Quantity = storeItem.Quantity;
                            _context.Stores.Update(inStoreItem);
                            await _context.SaveChangesAsync();
                            return StatusCode(200, inStoreItem);
                        }
                        return BadRequest(new ErrorMessage(Hu: "Tárolni kívánt termék nem található!", En: "Item to be stored cannot be found!"));
                    }
                    return BadRequest(new ErrorMessage(Hu: "Felhasználó nem található!", En: "User cannot be found!"));
                }
                return BadRequest(new ErrorMessage(Hu: "Mennyiség helytelen!", En: "Incorrect quantity!"));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpDelete]
        public async Task<ActionResult<Stores>> DeleteItemFromStorage([FromBody] Stores storeItem)
        {
            try
            {
                bool userExists = _context.Users.Any(x => x.Id == storeItem.UserId);
                if (userExists) {
                    Stores? inStoreItem = _context.Stores.Where(x => x.UserId == storeItem.UserId && x.ItemId == storeItem.ItemId).FirstOrDefault();
                    if (inStoreItem != null)
                    {
                        _context.Stores.Remove(inStoreItem);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
                    return BadRequest(new ErrorMessage(Hu: "Törölni kívánt termék nem található!", En: "Item to be deleted cannot be found!"));
                }
                return BadRequest(new ErrorMessage(Hu: "Felhasználó nem található!", En: "User cannot be found!"));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }
    }
}
