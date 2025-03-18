import type IType from "@/models/Type";
import instance from "./dataService";
import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";

export default {
    getTypes(){
        return instance.get('/types')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    addType(data: IType){
        return instance.post('/addType', data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    updateType(data: IType){
        return instance.post(`/updateType/${data.id}`, data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    deleteType(data: IType){
        return instance.post(`/deleteType/${data.id}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },

    // ITEMS
    getItems(){
        return instance.get('/items')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    getItemsByType(typid: number){
        return instance.get(`/items/typeid/${typid}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    addItem(data: Item){
        return instance.post('/addItem', data)
        .then((res: any)=>{
            return res //elmentet élelmiszert visszakérem és a lokális tömbhöz adom
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    updateItem(data: Item){
        return instance.post(`/updateItem/${data.itemId}`, data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    deleteItem(data: Item){
        return instance.post(`/deleteItem/${data.itemId}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },

    //RECIPES
    getRecipes(){
        return instance.get('/recipes')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    getRecipeById(id: number){
        return instance.get(`/recipes/${id}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
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