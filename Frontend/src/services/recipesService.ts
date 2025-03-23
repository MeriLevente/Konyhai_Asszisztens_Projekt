import { useAppStore } from "@/stores/appstore";
import instance from "./dataService";
import type IRecipe from "@/models/Recipe";

export default {
    getRecipes(){
        return instance.get('/recipes')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            console.error(useAppStore().app_language == "hu" ? err.data.hu : err.data.en)
            return Promise.reject();
        })
    },
    getRecipeById(id: number){
        return instance.get(`/recipes/${id}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            console.error(useAppStore().app_language == "hu" ? err.data.hu : err.data.en)
            return Promise.reject();
        })
    },
    getRecipesByType(type: string){
        return instance.get(`/recipes/type/${type}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            console.error(useAppStore().app_language == "hu" ? err.data.hu : err.data.en)
        })
    },
    addRecipe(data: IRecipe) {
        return instance.post('/addRecipe', data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    updateRecipe(data: IRecipe) {
        return instance.post(`/updateRecipe/${data.id}`, data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    deleteRecipe(data: IRecipe) {
        return instance.post(`/deleteRecipe/${data.id}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    }
};