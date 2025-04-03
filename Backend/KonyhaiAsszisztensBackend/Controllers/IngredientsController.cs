using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/ingredients")]
    [ApiController]
    public class IngredientsController : Controller
    {
        private readonly DataContext _context;
        public IngredientsController(DataContext context)
        {
            _context = context;
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Contains>>> GetItemsByRecipeId(int id)
        {
            try
            {
                var ingredients = _context.Contains.Where(x => x.RecipeId == id).Include(x => x.Item).ToList();
                return Ok(ingredients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Contains>>> StoreItemInStorage([FromBody] Contains ingredient)
        {
            try
            {
                if (ingredient.Quantity.ToString() != "" && ingredient.Quantity > 0 && ingredient.Quantity <= 10000)
                {
                    bool recipeExist = _context.Recipes.Any(x => x.Id == ingredient.RecipeId);
                    if (recipeExist)
                    {
                        var item = _context.Items.Where(x => x.Id == ingredient.ItemId).FirstOrDefault();
                        if (item != null)
                        {
                            Contains? storeItem = _context.Contains.Where(x => x.RecipeId == ingredient.RecipeId && x.ItemId == ingredient.ItemId).FirstOrDefault();
                            ingredient.Item = item;
                            if (storeItem == null)
                            {
                                _context.Contains.Add(ingredient);
                                await _context.SaveChangesAsync();
                                return StatusCode(201, ingredient);
                            }
                            storeItem.Quantity = ingredient.Quantity;
                            _context.Contains.Update(storeItem);
                            await _context.SaveChangesAsync();
                            return StatusCode(200, storeItem);
                        }
                        return BadRequest(new ErrorMessage(Hu: "A hozzávaló nem található!", En: "Ingredient cannot be found!"));
                    }
                    return BadRequest(new ErrorMessage(Hu: "Recept nem található", En: "Recipe cannot be found!"));
                }
                return BadRequest(new ErrorMessage(Hu: "Mennyiség helytelen!", En: "Incorrect quantity!"));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> ClearAllIngredientsFromRecipe(int id)
        {
            try
            {
                foreach (var item in _context.Contains.Where(x => x.RecipeId == id))
                {
                    _context.Contains.Remove(item);
                };
                await _context.SaveChangesAsync();
                return StatusCode(204);
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }
    }
}
