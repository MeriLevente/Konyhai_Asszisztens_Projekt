import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { useAdminStore } from "@/stores/adminstore";
import { useUserStore } from "@/stores/userstore";

export default class DataLoader{
    public static clearLocalStorage(){
        const lang: string = localStorage.getItem('lang')!.toString();
        localStorage.clear()
        localStorage.setItem('lang', lang);
    }
    public static loadTypes(){
        if(!localStorage.getItem('types'))
            useAdminStore().getTypes()
        else{
            let types: IType[] = [];
            var jsonData = JSON.parse(localStorage.getItem('types')!.toString());
            for (var i = 0; i < jsonData.length; i++) {
                types.push(jsonData[i])
            }
            useAdminStore().types = types;
        }
    }
    public static loadItems(){
        if(!localStorage.getItem('items'))
            useAdminStore().getItems()
        else{
            let items: Item[] = [];
            var jsonData = JSON.parse(localStorage.getItem('items')!.toString());
            for (var i = 0; i < jsonData.length; i++) {
                items.push(jsonData[i])
            }
            useAdminStore().items = items;
        }
    }
    public static loadRecipes(){
        if(!localStorage.getItem('recipes'))
            useAdminStore().getRecipes()
        else{
            let recipes: IRecipe[] = [];
            var jsonData = JSON.parse(localStorage.getItem('recipes')!.toString());
            for (var i = 0; i < jsonData.length; i++) {
                recipes.push(jsonData[i])
            }
            useAdminStore().recipes = recipes;
        }
    }
    public static async loadViewedRecipe(id: number){
        await useUserStore().getRecipeById(id);
    }
}