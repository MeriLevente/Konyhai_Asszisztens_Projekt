import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { useAdminStore } from "@/stores/adminstore";
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
        useAdminStore().getRecipes()
    }
    public static async loadViewedRecipe(id: number){
        await useUserStore().getRecipeById(id);
    }
}