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
        recipesError: {
            hu: "",
            en: ""
        },
        recipesLoading: false,
        recipesAllLength: Number(sessionStorage.getItem("recipesMaxLength")) ?? 0,
        paginatorValues: {
            from: Number(sessionStorage.getItem("paginator-from")) ?? 0,
            to: Number(sessionStorage.getItem("paginator-to")) ?? 6
        },
        recipeTypes: [
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
            this.recipesLoading = true;
            recipesService.getRecipes()
                .then((res: any) => {
                    this.recipesLoading = false;
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    this.recipesLoading = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getAllRecipesLength() {
                    return recipesService.getRecipesLength()
                        .then((res: any) => {
                            this.recipesAllLength = res.data.length;
                            sessionStorage.setItem("recipesMaxLength", `${res.data.length}`);
                            return res.data.length;
                        })
                        .catch((err: any) => {
                            console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                        });
        },
        getRecipesByType(type: string) {
            this.recipesLoading = true;
            return recipesService.getRecipesByType(type)
                .then((res: any) => {
                    this.recipesLoading = false;
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    this.recipesLoading = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getRecipesBySearch(search: string) {
            this.recipesLoading = true;
            return recipesService.getRecipesBySearch(search)
                .then((res: any) => {
                    this.recipesLoading = false;
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    this.recipesLoading = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        loadRecipesPaginated(from: number, to: number) {
            return recipesService.getRecipesPaginated(from, to).
                then((res: any) => {
                    this.paginatorValues.to = to;
                    this.paginatorValues.from = from;
                    sessionStorage.setItem("paginator-from", `${Number(from)}`);
                    sessionStorage.setItem("paginator-to", `${Number(to)}`);
                    this.recipes = res.data;
                })
                .catch((err: any) => {
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        saveRecipes(data: IRecipe) {
            let validation = RecipeValidation.RecipeIsCorrect(
                data.name, data.name_EN, data.difficulty, data.time, data.image, data.type, data.description, data.description_EN
            );
            if (!validation.isError) {
                const ingredients = data.ingredients;
                if (data.id) {
                    return recipesService.updateRecipe(data)
                            .then((res: any) => {
                                this.recipesError.hu = "";
                                this.recipesError.en = "";
                                this.clearAndAddIngredient(data.id!, ingredients);
                                res.data.ingredients = ingredients;
                                this.recipes[this.recipes.findIndex(x=> x.id == data.id)] = res.data;
                            })
                            .catch((err: any) => {
                                this.recipesError = err;
                                return Promise.reject();
                            });
                } else {
                    return recipesService.addRecipe(data)
                            .then((res: any) => {
                                this.recipesError.hu = "";
                                this.recipesError.en = "";
                                const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                                if (this.recipes.length < pagiDiff) {
                                    this.recipes.push(res.data);
                                }
                                this.clearAndAddIngredient(res.data.id, ingredients);
                                if (this.paginatorValues.from == 0 && this.paginatorValues.to == this.recipesAllLength) {
                                    window.location.reload();
                                }
                                this.recipesAllLength += 1;
                                sessionStorage.setItem("recipesMaxLength", `${this.recipesAllLength}`);
                            })
                            .catch((err: any) => {
                                this.recipesError.hu = err.hu;
                                this.recipesError.en = err.en;
                                return Promise.reject();
                            });
                };
            } else {
                this.recipesError.hu = validation.message!
                this.recipesError.en = validation.messageEn!;
                return Promise.reject();
            };
        },
        deleteRecipe(data: IRecipe) {
            return recipesService.deleteRecipe(data)
            .then(() => {
                this.recipesAllLength -= 1;
                sessionStorage.setItem("recipesMaxLength", `${this.recipesAllLength}`);
                this.recipes.splice(this.recipes.indexOf(data), 1);
                if (this.recipes.length == 0) {
                    this.loadRecipesPaginated(0, this.paginatorValues.to - this.paginatorValues.from);
                    useAppStore().paginatorLastElementDeleted = true;
                };
            })
            .catch((err: any) => {
                return Promise.reject(useAppStore().appLanguage == "hu" ? err.hu : err.en);
            });
        },
        clearAndAddIngredient(id: number, ingrArray: Ingredient[]) {
            const ingredients = ingrArray;
            if (ingredients) {
                return recipesService.clearIngredients(id).then(() => {
                    ingredients.forEach(ingr => {
                        return recipesService.addIngredent({recipeId: id, itemId: ingr.item.id, quantity: ingr.quantity})
                            .then((result: any) => {
                                if (result.data) {
                                    const recipe = this.recipes[this.recipes.findIndex(x=> x.id == id)];
                                    recipe.ingredients.push(result.data);
                                };
                            })
                            .catch((err: any)=>{
                                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                            }); 
                        })
                    }).catch((err: any)=>{
                        console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                    });
            }
        }
    }
});