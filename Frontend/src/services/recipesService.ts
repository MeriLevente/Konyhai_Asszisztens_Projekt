import instance from "./dataService";
import type IRecipe from "@/models/Recipe";

export default {
    getRecipes(){
        return instance.get('/recipes')
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    getRecipesLength(){
        return instance.get('/recipes/length')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    getRecipesPaginated(from: number, to: number){
        return instance.get(`/recipes/from/${from}/to/${to}`)
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    getRecipeById(id: number){
        return instance.get(`/recipes/${id}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err);
        })
    },
    getRecipesByType(type: string){
        return instance.get(`/recipes/type/${type}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    getRecipesBySearch(searchWord: string){
        return instance.get(`/recipes/search/${searchWord}`)
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    addRecipe(data: IRecipe) {
        data.ingredients = [];
        return instance.post('/recipes', data)
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            return Promise.reject(err);
        });
    },
    updateRecipe(data: IRecipe) {
        data.ingredients = [];
        return instance.put(`/recipes`, data)
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    addIngredent(data: any) {
        return instance.post(`/ingredients`, data)
        .then((res: any)=>{
            return res;
        })
        .catch((err: any)=>{
            return Promise.reject(err);
        });
    },
    clearIngredients(id: number) {
        return instance.delete(`/ingredients/${id}`)
        .catch((err: any)=>{
            console.error(err);
            return Promise.reject(err);
        });
    },
    deleteRecipe(data: IRecipe) {
        return instance.delete(`/recipes/${data.id}`)
            .then((res: any)=>{
                return res;
            })
            .catch((err: any)=>{
                return Promise.reject(err);
            });
    }
};