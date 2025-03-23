import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { useItemStore } from "@/stores/itemstore";
import { useRecipeStore } from "@/stores/recipestore";
import { useTypeStore } from "@/stores/typestore";
import { useUserStore } from "@/stores/userstore";

export default class DataLoader{
    public static clearSessionStorage(){
        sessionStorage.clear()
    }
    public static loadTypes(){
        useTypeStore().getTypes()
    }
    public static loadItems(){
        useItemStore().getItems()
    }
    public static loadRecipes(){
        const selectedType: string | null = sessionStorage.getItem("selectedRecipeType");
        if(!selectedType || selectedType == "0")
            useRecipeStore().getRecipes();
        else
            useRecipeStore().getRecipesByType(selectedType);
    }
    public static async loadViewedRecipe(id: number){
        await useUserStore().getRecipeById(id);
    }
}