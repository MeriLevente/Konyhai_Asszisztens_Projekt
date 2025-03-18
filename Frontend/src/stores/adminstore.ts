import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import adminService from "@/services/adminService";
import ItemValidation from "@/utils/ItemValidation";
import RecipeValidation from "@/utils/RecipeValidation";
import TypeValidation from "@/utils/TypeValidation";
import { defineStore } from "pinia";

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        types: <IType[]> [{
            
        }],
        type_error: {
            hu: "",
            en: ""
        },

        items: <Item[]> [{
            
        }],
        units: <string[]> [
            "darab",
            "g",
            "ml"
        ],
        items_error: {
            hu: "",
            en: ""
        },

        recipes: <IRecipe[]> [

        ],
        recipes_error: {
            hu: "",
            en: ""
        },
        recipe_types: {
            types: [
                {short: "AME", hu: "Amerikai", en: "American"},
                {short: "ASI", hu: "Ázsiai", en: "Asian"},
                {short: "BRE", hu: "Reggeli", en: "Breakfast"},
                {short: "DES", hu: "Desszert", en: "Dessert"},
                {short: "HUN", hu: "Magyaros", en: "Hungarian"},
                {short: "ITA", hu: "Olasz", en: "Italian"},
                {short: "MEX", hu: "Mexikói", en: "Mexican"}
            ]
        },
        savedImageUrl: <string> ''
    }),
    actions: {
        imageChange(file: any){
            const selectedImage = file;
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.savedImageUrl = e.target!.result!.toString();
            };
            reader.readAsDataURL(selectedImage);
            return this.savedImageUrl;
        },

        //Types
        getTypes(): Promise<IType[]>{
            adminService.getTypes()
                .then((res: any)=>{
                    this.types = res.data;
                    localStorage.setItem("types", JSON.stringify(res.data))
                    return res.data;
                }
                )
                .catch((err:any)=>{
                    console.log(err);
                    return Promise.reject();
                })
            return Promise.reject()
        },
        saveType(data: IType){
            let validation = TypeValidation.TypeAllFilled(data.name_HU, data.name_EN, data.image);
            if (!validation.isError) {   
                if (data.id) {
                    return adminService.updateType(data)
                            .then((res: any)=>{
                                this.type_error.hu = "";
                                this.type_error.en = "";
                                this.types[this.types.indexOf(data)] = res;
                            })
                            .catch((err: any)=>{
                                this.type_error.hu = err.message;
                                this.type_error.en = err.messageEn;
                                return Promise.reject();
                            });;
                } else {
                    return adminService.addType(data)
                            .then((res: any)=>{
                                this.type_error.hu = "";
                                this.type_error.en = "";
                                this.types.push(res);
                            })
                            .catch((err: any)=>{
                                this.type_error.hu = err.message;
                                this.type_error.en = err.messageEn;
                                return Promise.reject();
                            });
                }
            } else {
                this.type_error.hu = validation.message!;
                this.type_error.en = validation.messageEn!;
            }
        },
        deleteType(data: IType){
            if (data) {
                return adminService.deleteType(data)
                .then(()=>{
                    this.type_error.hu = "";
                    this.type_error.en = "";
                    this.types.splice(this.types.indexOf(data), 1);
                })
                .catch((err: any)=>{
                    this.type_error.hu = err.message;
                    this.type_error.en = err.messageEn;
                    return Promise.reject();
                });
            } else {
                this.type_error.hu = "Sikertelen törlés";
                this.type_error.en = "Delete failed!";
                return Promise.reject();
            }
        },

        // ITEMS
        getItems(): Promise<Item[]>{
            adminService.getItems()
                .then((res: any)=>{
                    this.items = res.data;
                    localStorage.setItem("items", JSON.stringify(res.data))
                    return res.data;
                }
                )
                .catch((err:any)=>{
                    console.log(err);
                    return Promise.reject();
                })
            return Promise.reject()
        },
        getItemsByTypeId(typeid: number){
            adminService.getItemsByType(typeid)
                .then((res: any)=>{
                    this.items = res.data;
                }
                )
                .catch((err:any)=>{
                    console.error(err);
                    return Promise.reject();
                })
            return Promise.reject()
        },
        saveItem(data: Item){
            let validation = ItemValidation.ItemAllFilled(data.name, data.name_EN, data.typeId, data.unit, data.image);
            if (!validation.isError) {   
                if (data.itemId) {
                    return adminService.updateItem(data)
                            .then((res: any)=>{
                                this.items_error.hu = "";
                                this.items_error.en = "";
                                this.items[this.items.indexOf(data)] = res;
                            })
                            .catch((err: any)=>{
                                this.items_error.hu = err.message;
                                this.items_error.en = err.messageEn;
                                return Promise.reject();
                            });;
                } else {
                    return adminService.addItem(data)
                            .then((res: any)=>{
                                this.items_error.hu = "";
                                this.items_error.en = "";
                                this.types.push(res);
                            })
                            .catch((err: any)=>{
                                this.items_error.hu = err.message;
                                this.items_error.en = err.messageEn;
                                return Promise.reject();
                            });
                }
            } else {
                this.items_error.hu = validation.message!;
                this.items_error.en = validation.messageEn!;
            }
        },
        deleteItem(data: Item){
            if (data) {
                return adminService.deleteItem(data)
                .then(()=>{
                    this.items_error.hu = "";
                    this.items_error.en = "";
                    this.items.splice(this.items.indexOf(data), 1);
                })
                .catch((err: any)=>{
                    this.items_error.hu = err.message;
                    this.items_error.en = err.messageEn;
                    return Promise.reject();
                });
            } else {
                this.items_error.hu = "Sikertelen törlés";
                this.items_error.en = "Delete failed!";
                return Promise.reject();
            }
        },

        //RECIPES
        getRecipes(): Promise<IRecipe[]>{
            adminService.getRecipes()
                .then((res: any)=>{
                    this.recipes = res.data;
                    localStorage.setItem("recipes", JSON.stringify(res.data))
                    return res.data;
                }
                )
                .catch((err:any)=>{
                    console.log(err);
                    return Promise.reject();
                })
            return Promise.reject()
        },
        saveRecipes(data: IRecipe){
            let validation = RecipeValidation.RecipeIsCorrect(
                data.name, data.name_EN, data.difficulty, data.time, data.image, data.type, data.description, data.description_EN, data.ingredients!
            );
            if (!validation.isError) {   
                if (data.id) {
                    return adminService.updateRecipe(data)
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
                    return adminService.addRecipe(data)
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
                return adminService.deleteRecipe(data)
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
                this.recipes_error.hu = "Sikertelen törlés";
                this.recipes_error.en = "Delete failed!";
                return Promise.reject();
            }
        }
    }
});