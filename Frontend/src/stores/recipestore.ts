import type IRecipe from "@/models/Recipe";
import recipesService from "@/services/recipesService";
import RecipeValidation from "@/utils/RecipeValidation";
import { defineStore } from "pinia";
import { useAppStore } from "./appstore";
import type Ingredient from "@/models/Ingredient";

export const useRecipeStore = defineStore('recipeStore', {
    state: () => ({
        recipes: <IRecipe[]> [

        ],
        recipes_error: {
            hu: "",
            en: ""
        },
        recipesAllLength: Number(sessionStorage.getItem("recipesMaxLength")) ?? 0,
        paginatorValues: {
            from: Number(sessionStorage.getItem("paginator-from")) ?? 0,
            to: Number(sessionStorage.getItem("paginator-to")) ?? 6
        },
        recipe_types: [
                {short: "AME", hu: "Amerikai", en: "American"},
                {short: "ASI", hu: "Ázsiai", en: "Asian"},
                {short: "BRE", hu: "Reggeli", en: "Breakfast"},
                {short: "DES", hu: "Desszert", en: "Dessert"},
                {short: "HUN", hu: "Magyaros", en: "Hungarian"},
                {short: "ITA", hu: "Olasz", en: "Italian"},
                {short: "MEX", hu: "Mexikói", en: "Mexican"}
        ]
    }),
    actions: {
        getRecipes() {
            recipesService.getRecipes()
                .then((res: any)=>{
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                })
        },
        getAllRecipesLength(){
                    return recipesService.getRecipesLength()
                        .then((res: any)=>{
                            this.recipesAllLength = res.data.length
                            sessionStorage.setItem("recipesMaxLength", `${res.data.length}`);
                            return res.data.length;
                        })
                        .catch((err: any)=>{
                            console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                        })
        },
        getRecipesByType(type: string) {
            return recipesService.getRecipesByType(type)
                .then((res: any)=>{
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                })
        },
        getRecipesBySearch(search: string) {
            return recipesService.getRecipesBySearch(search)
                .then((res: any)=>{
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                })
        },
        loadRecipesPaginated(from: number, to: number){
            return recipesService.getRecipesPaginated(from, to).
                then((res: any)=>{
                            this.paginatorValues.to = to;
                            this.paginatorValues.from = from;
                            sessionStorage.setItem("paginator-from", `${Number(from)}`);
                            sessionStorage.setItem("paginator-to", `${Number(to)}`);
                            this.recipes = res.data;
                })
                .catch((err: any) => {
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                })
        },
        saveRecipes(data: IRecipe){
            let validation = RecipeValidation.RecipeIsCorrect(
                data.name, data.name_EN, data.difficulty, data.time, data.image, data.type, data.description, data.description_EN, data.ingredients!
            );
            if (!validation.isError) {
                const ingredients = data.ingredients;
                if (data.id) {
                    return recipesService.updateRecipe(data)
                            .then((res: any)=>{
                                this.recipes_error.hu = "";
                                this.recipes_error.en = "";
                                this.clearAndAddIngredient(data.id!, ingredients);
                                res.data.ingredients = ingredients;
                                this.recipes[this.recipes.findIndex(x=> x.id == data.id)] = res.data;
                            })
                            .catch((err: any)=>{
                                this.recipes_error = err;
                                return Promise.reject();
                            });;
                } else {
                    return recipesService.addRecipe(data)
                            .then((res: any)=>{
                                this.recipes_error.hu = "";
                                this.recipes_error.en = "";
                                const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                                if(this.recipes.length < pagiDiff){
                                    this.recipes.push(res.data);
                                }
                                this.clearAndAddIngredient(res.data.id, ingredients);
                                this.recipesAllLength += 1;
                                sessionStorage.setItem("recipesMaxLength", `${this.recipesAllLength}`);
                                
                            })
                            .catch((err: any)=>{
                                this.recipes_error.hu = err.hu;
                                this.recipes_error.en = err.en;
                                return Promise.reject();
                            });
                }
            } else {
                this.recipes_error.hu = validation.message!
                this.recipes_error.en = validation.messageEn!;
            }
        },
        deleteRecipe(data: IRecipe){
            return recipesService.deleteRecipe(data)
            .then(()=>{
                this.recipesAllLength -= 1;
                sessionStorage.setItem("recipesMaxLength", `${this.recipesAllLength}`);
                this.recipes.splice(this.recipes.indexOf(data), 1);
                if (this.recipes.length == 0) {
                    this.loadRecipesPaginated(0, this.paginatorValues.to - this.paginatorValues.from);
                    useAppStore().paginatorLastElementDeleted = true;
                }
            })
            .catch((err: any)=>{
                return Promise.reject(useAppStore().app_language == "hu" ? err.hu : err.en);
            });
        },
        clearAndAddIngredient(id: number, ingrArray: Ingredient[]){
            const ingredients = ingrArray;
            if (ingredients) {
            return recipesService.clearIngredients(id).then(()=>{
            ingredients.forEach(ingr => {
                return recipesService.addIngredent({recipeId: id, itemId: ingr.item.id, quantity: ingr.quantity})
                    .then((result: any)=>{
                        if(result.data){
                            const recipe = this.recipes[this.recipes.findIndex(x=> x.id == id)];
                            recipe.ingredients.push(result.data);
                        }
                })
                .catch((err: any)=>{
                        console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                   }); 
                })
                }).catch((err: any)=>{
                   console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                });
            }
        }
        }
})