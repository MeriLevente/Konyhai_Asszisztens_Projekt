import type IRecipe from "@/models/Recipe";
import recipesService from "@/services/recipesService";
import RecipeValidation from "@/utils/RecipeValidation";
import { defineStore } from "pinia";

export const useRecipesStore = defineStore('recipesStore', {
    state: () => ({
        recipes: <IRecipe[]> [

        ],
        recipes_error: {
            hu: "",
            en: ""
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
        },
        getRecipesByType(type: string) {
            return recipesService.getRecipesByType(type)
                .then((res: any)=>{
                    this.recipes = res.data;
            })
        },
        getRecipesBySearcg(search: string) {
            return recipesService.getRecipesBySearch(search)
                .then((res: any)=>{
                    this.recipes = res.data;
            })
        },
        saveRecipes(data: IRecipe){
            let validation = RecipeValidation.RecipeIsCorrect(
                data.name, data.name_EN, data.difficulty, data.time, data.image, data.type, data.description, data.description_EN, data.ingredients!
            );
            if (!validation.isError) {
                if (data.id) {
                    return recipesService.updateRecipe(data)
                            .then((res: any)=>{
                                this.recipes_error.hu = "";
                                this.recipes_error.en = "";
                                this.recipes[this.recipes.indexOf(data)] = res;
                            })
                            .catch((err: any)=>{
                                this.recipes_error.hu = err.message;
                                this.recipes_error.en = err.messageEn;
                                return Promise.reject();
                            });;
                } else {
                    return recipesService.addRecipe(data)
                            .then((res: any)=>{
                                this.recipes_error.hu = "";
                                this.recipes_error.en = "";
                                this.recipes.push(res);
                            })
                            .catch((err: any)=>{
                                this.recipes_error.hu = err.message;
                                this.recipes_error.en = err.messageEn;
                                return Promise.reject();
                            });
                }
            } else {
                this.recipes_error.hu = validation.message!;
                this.recipes_error.en = validation.messageEn!;
            }
        },
        deleteRecipe(data: IRecipe){
            if (data) {
                return recipesService.deleteRecipe(data)
                .then(()=>{
                    this.recipes_error.hu = "";
                    this.recipes_error.en = "";
                    this.recipes.splice(this.recipes.indexOf(data), 1);
                })
                .catch((err: any)=>{
                    this.recipes_error.hu = err.message;
                    this.recipes_error.en = err.messageEn;
                    return Promise.reject();
                });
            } else {
                return Promise.reject();
            }
        }
    }
})