import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { useAdminStore } from "@/stores/adminstore";
import { useRecipesStore } from "@/stores/recipesstore";
import { useUserStore } from "@/stores/userstore";

export default class DataLoader{
    public static clearSessionStorage(){
        sessionStorage.clear()
    }
    public static loadTypes(){
        useAdminStore().getTypes()
    }
    public static loadItems(){
        useAdminStore().getItems()
    }
    public static loadRecipes(){
        const selectedType: string | null = sessionStorage.getItem("selectedRecipeType");
        if(!selectedType || selectedType == "0")
            useRecipesStore().getRecipes();
        else
            useRecipesStore().getRecipesByType(selectedType);
    }
    public static async loadViewedRecipe(id: number){
        await useUserStore().getRecipeById(id);
    }
}