import type IFormResponse from "@/models/FormResponse";
import type ILoggedInUser from "@/models/LoggedInUser";
import type StoredItem from "@/models/StoredItem";
import type IUser from "@/models/User";
import storageService from "@/services/storageService";
import userService from "@/services/userService";
import DataLoader from "@/utils/DataLoader";
import SearchValidation from "@/utils/SearchValidation";
import UserValidation from "@/utils/UserValidation";
import {defineStore} from "pinia";
import { useAppStore } from "./appstore";
import type IRecipe from "@/models/Recipe";
import adminService from "@/services/adminService";
import recipesService from "@/services/recipesService";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: <ILoggedInUser | undefined>{

        },
        status : {
            loggedIn: false,
            message: '',
            messageEn: '',
            confirm_password: ''
        },
        storedItems: <StoredItem[]> [

        ],
        viewedRecipe: <IRecipe>{}
    }),
    actions: {
        hideError() {
            this.status.message = '';
            this.status.messageEn = '';
        },
        login(data: IUser) {
            let validation: IFormResponse = UserValidation.LoginIsValid(data.email, data.password)
            if(!validation.isError){
                return userService.login(data)
                        .then((res: any) => {
                            this.status.loggedIn = true;
                            this.hideError();
                            this.user = res.data;
                            sessionStorage.setItem("user", JSON.stringify(this.user));
                            sessionStorage.setItem("token", JSON.stringify(this.user?.token));
                        })
                        .catch((err: any)=>{
                            this.status.loggedIn = false;
                            this.status.message = err.hu;
                            this.status.messageEn = err.en;
                            this.user = {name: "", token: "", id: null, role: ""};
                            return Promise.reject();
                        })
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
            }
        },
        register(data: IUser){
            let validation: IFormResponse = UserValidation.RegisterIsValid(data.name!, data.email, data.password, this.status.confirm_password)
            if(!validation.isError){
                return userService.register(data)
                            .then((res: any) => {
                                this.status.loggedIn = true;
                                this.hideError();
                                this.status.confirm_password = "";
                                this.user = res.data;
                                sessionStorage.setItem("user", JSON.stringify(this.user));
                                sessionStorage.setItem("token", JSON.stringify(this.user?.token));
                            })
                            .catch((err: any)=>{
                                this.status.loggedIn = false;
                                this.status.message = err.hu;
                                this.status.messageEn = err.en;
                                this.user = {name: "", token: "", id: null, role: ""};
                                return Promise.reject();
                            })
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
            }
        },
        logout(){
            return userService.logout(this.user!.id!)
                .then(()=>{
                    this.status.loggedIn = false;
                    this.user = undefined;
                    DataLoader.clearSessionStorage();
                })
                .catch(()=>{
                    this.status.loggedIn = false;
                    this.user = undefined;
                    DataLoader.clearSessionStorage();
                })
        },
        getStoredItems(){
            return storageService.getStoredItems()
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err)=>
                    console.error(err.hu)
                )
        },
        getStoredItemsByTypeId(typeId: number){
            return storageService.getStoredItemsByTypeId(typeId)
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err)=>
                    console.error(err.hu)
                )
        },
        getStoredItemsBySearch(typeId: number | null, sWord: string | undefined){
            let validation: IFormResponse = SearchValidation.SearchedWordIsValid(sWord);
            if(!validation.isError){
                return storageService.getStoredItemsBySearch(typeId, sWord!)
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err)=>
                    console.error(err.hu)
                )
            } else {
                alert(useAppStore().app_language == 'hu' ? validation.message : validation.messageEn);
            }
        },
        getRecipeById(id:number){
            return recipesService.getRecipeById(id)
                .then((res: any)=>{
                    this.viewedRecipe = res.data;
                    sessionStorage.setItem('viewed_recipe', JSON.stringify(this.viewedRecipe));
                }).catch((err: any)=>
                    console.error(err.hu)
                )
        }
    }
});