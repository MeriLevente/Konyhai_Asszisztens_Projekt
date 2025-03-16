import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { useAdminStore } from "@/stores/adminstore";

export default class DataLoader{
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
}