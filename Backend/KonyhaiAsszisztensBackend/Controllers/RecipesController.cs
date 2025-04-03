using KonyhaiAsszisztensBackend.Data;
using KonyhaiAsszisztensBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace KonyhaiAsszisztensBackend.Controllers
{
    [Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/recipes")]
    [ApiController]
    public class RecipesController : Controller
    {
        private readonly DataContext _context;

        public RecipesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetAllRecipes()
        {
            try
            {
                var recipes = _context.Recipes.ToList();
                recipes.ForEach(y =>
                {
                    Task<List<Contains>> ingr = _context.Contains.Include(c => c.Item).Where(x => x.RecipeId == y.Id).ToListAsync();
                    y.Ingredients = ingr.Result;
                });
                return Ok(recipes);
            } 
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            } 
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("length")]
        public async Task<ActionResult<DataLength>> GetAllRecipesLength()
        {
            try
            {
                var recipes = _context.Recipes.ToList();
                return Ok(new DataLength(recipes.Count));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet("from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipesPaginated(int from, int to)
        {
            try
            {
                if ((from >= 0 && to >= 0) && from < to)
                {
                    List<Recipes> recipes = _context.Recipes.ToList().Skip(from).Take(to - from).ToList();
                    recipes.ForEach(y =>
                    {
                        Task<List<Contains>> ingr = _context.Contains.Include(c => c.Item).Where(x => x.RecipeId == y.Id).ToListAsync();
                        y.Ingredients = ingr.Result;
                    });
                    return Ok(recipes);
                }
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("search/{searchedword}")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipeBySearch(string searchedword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                var recipes = _context.Recipes.Where(x => language == "hu" ? x.Name.ToLower().Contains(searchedword.ToLower()) : x.Name_EN.ToLower().Contains(searchedword.ToLower())).ToList();
                recipes.ForEach(y =>
                {
                    Task<List<Contains>> ingr = _context.Contains.Include(c => c.Item).Where(x => x.RecipeId == y.Id).ToListAsync();
                    y.Ingredients = ingr.Result;
                });
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("search/{searchedword}/length")]
        public async Task<ActionResult<DataLength>> GetRecipeBySearchLength(string searchedword)
        {
            try
            {
                string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                var recipes = _context.Recipes.Where(x => language == "hu" ? x.Name.ToLower().Contains(searchedword.ToLower()) : x.Name_EN.ToLower().Contains(searchedword.ToLower())).ToList();
                return Ok(new DataLength(recipes.Count));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet("search/{searchedword}/from/{from}/to/{to}")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipesPaginatedBySearch(string searchedword, int from, int to)
        {
            try
            {
                if ((from >= 0 && to >= 0) && from < to)
                {
                    string language = Request.Headers["Accept-Language"].ToString() ?? "hu";
                    var recipes = _context.Recipes.Include(x=> x.Ingredients).Where(x => language == "hu" ? x.Name.ToLower().Contains(searchedword.ToLower()) : x.Name_EN.ToLower().Contains(searchedword.ToLower())).ToList();
                    return Ok(recipes.Skip(from).Take(to - from));
                }
                return BadRequest(new ErrorMessage(Hu: "Hibás tól vagy ig szám!", En: "Incorrect from or to number!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipeById(int id)
        {
            try
            {
                var recipe = _context.Recipes.Where(x => x.Id == id).FirstOrDefault();
                if (recipe != null)
                {
                    recipe.Ingredients = await _context.Contains.Include(c => c.Item).Where(x => x.RecipeId == id).ToListAsync();
                    return Ok(recipe);
                }
                return BadRequest(new ErrorMessage(Hu: $"{id} azonosítójú recept nem található!", En: $"Recipe with id: {id} cannot be found!"));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<Recipes>>> GetRecipeByType(string type)
        {
            try
            {
                var recipes = _context.Recipes.Where(x => x.Type.ToLower() == type.ToLower()).ToList();
                if (recipes != null)
                {
                    recipes.ForEach(y =>
                    {
                        Task<List<Contains>> ingr = _context.Contains.Include(c => c.Item).Where(x => x.RecipeId == y.Id).ToListAsync();
                        y.Ingredients = ingr.Result;
                    });
                    return Ok(recipes);
                }
                return BadRequest(new ErrorMessage(Hu: $"{type} típusú recept nem található!", En: $"Recipe with type: {type} cannot be found!"));
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpGet]
        [Microsoft.AspNetCore.Mvc.Route("getTypes")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllTypes()
        {
            try
            {
                return Ok(_context.Recipes.ToList().Select(x => x.Type).Distinct());
            }
            catch
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<Recipes>> SaveRecipe([FromBody] Recipes newData)
        {
            try
            {
                if (newData != null)
                {
                    _context.Recipes.Add(newData);
                    await _context.SaveChangesAsync();
                    return StatusCode(201, newData);
                }
                return BadRequest(new ErrorMessage(Hu: $"Új recept nem található!", En: $"new recipe cannot be found!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: $"Hiba történt!", En: $"An error occured!"));
            }
        }

        [HttpPut]
        public async Task<ActionResult<Recipes>> UpdateRecipe([FromBody] Recipes newData)
        {
            try
            {
                bool recipeToBeModied = _context.Recipes.Any(x => x.Id == newData.Id);
                if (recipeToBeModied != false)
                {
                    _context.Recipes.Entry(newData).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return Ok(newData);
                }
                return BadRequest(new ErrorMessage(Hu: $"Nem található a recept (id: {newData.Id}) !", En: $"Recipe can not be found (id: {newData.Id})!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: $"Hiba történt!", En: $"An error occured!"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Recipes>> DeleteRecipe(int id)
        {
            try
            {
                Recipes? recipeToBeDeleted = _context.Recipes.Where(x => x.Id == id).SingleOrDefault();
                if (recipeToBeDeleted != null)
                {
                    List<Contains> items = _context.Contains.Where(x => x.RecipeId == id).ToList();
                    if (items.Count == 0)
                    {
                        _context.Recipes.Remove(recipeToBeDeleted);
                        await _context.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    return BadRequest(new ErrorMessage(Hu: $"Receptet nem lehet törölni, mert {items.Count} hozzávaló hivatkozik rá!", En: $"Recipe can not be deleted, because {items.Count} ingredient refers to it!"));
                }
                return BadRequest(new ErrorMessage(Hu: $"Id ({id}) nem található a receptek táblában!", En: $"Id ({id}) cannot be found in recipes table!"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorMessage(Hu: "Hiba történt!", En: "An error occured!"));
            }
        }
    }
}
