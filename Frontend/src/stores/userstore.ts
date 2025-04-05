import type IFormResponse from "@/models/FormResponse";
import type ILoggedInUser from "@/models/LoggedInUser";
import type IStoredItem from "@/models/StoredItem";
import type IUser from "@/models/User";
import storageService from "@/services/storageService";
import userService from "@/services/userService";
import DataLoader from "@/utils/DataLoader";
import SearchValidation from "@/utils/SearchValidation";
import UserValidation from "@/utils/UserValidation";
import {defineStore} from "pinia";
import { useAppStore } from "./appstore";
import type IRecipe from "@/models/Recipe";
import recipesService from "@/services/recipesService";
import CryptoJS from 'crypto-js'

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
        storedItems: <IStoredItem[]> [

        ],
        viewedRecipe: <IRecipe>{},
        selectedItemtype: 0,
        storedItemsAllLength: 0,
        showAllTrig: false,
        searchStorageInAction: false,
        paginatorValues: {
            from: 0,
            to: 6
        }
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
                            const hashedRole = CryptoJS.AES.encrypt(this.user?.role!, import.meta.env.VITE_SECRET_WORD).toString();
                            this.user!.role = hashedRole;
                            sessionStorage.setItem("user", JSON.stringify(
                            {
                                id: this.user?.id,
                                name: this.user?.name,
                                role: hashedRole
                            }));
                            sessionStorage.setItem("token", JSON.stringify(this.user?.token));
                        })
                        .catch((err: any)=>{
                            this.status.message = err.hu;
                            this.status.messageEn = err.en;
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
                return userService.register(data, data.role)
                            .then((res: any) => {
                                this.status.loggedIn = true;
                                this.hideError();
                                this.status.confirm_password = "";
                                if(data.role == "user"){
                                    this.user = res.data;
                                    const hashedRole = CryptoJS.AES.encrypt(this.user?.role!, import.meta.env.VITE_SECRET_WORD).toString();
                                    this.user!.role = hashedRole;
                                    sessionStorage.setItem("user", JSON.stringify(
                                    {
                                        id: this.user?.id,
                                        name: this.user?.name,
                                        role: hashedRole
                                    }));
                                    sessionStorage.setItem("token", JSON.stringify(this.user?.token));
                                }
                            })
                            .catch((err: any)=>{
                                this.status.message = err.hu;
                                this.status.messageEn = err.en;
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
        getStoredItems(loadIntoStore: boolean){
            return storageService.getStoredItems()
                .then((res: any)=>{
                    if(loadIntoStore)
                        this.storedItems = res.data;
                    else
                        return res.data;
                }).catch((err: any)=>
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en)
                )
        },
        loadStoredItemsPaginated(from: number, to: number){
            return storageService.getStoredItemsPaginated(from, to)
                .then((res: any)=>{
                    this.paginatorValues.to = to;
                    this.paginatorValues.from = from;
                    sessionStorage.setItem("paginator-from", `${Number(from)}`);
                    sessionStorage.setItem("paginator-to", `${Number(to)}`);
                    this.storedItems = res.data;
                }).catch((err: any)=>
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en)
                )
        },
        getStorageLength(){
            return storageService.getStorageLength()
                .then((res: any)=>{
                    this.storedItemsAllLength = res.data.length
                    sessionStorage.setItem("storageMaxLength", `${res.data.length}`);
                    return res.data.length;
                })
                .catch((err: any)=>{
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en);
                })
        },
        getStoredItemsByTypeId(typeId: number){
            return storageService.getStoredItemsByTypeId(typeId)
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err: any)=>
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en)
                )
        },
        getStoredItemsBySearch(typeId: number | null, sWord: string | undefined){
            let validation: IFormResponse = SearchValidation.SearchedWordIsValid(sWord);
            if(!validation.isError){
                return storageService.getStoredItemsBySearch(typeId, sWord!)
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err: any)=>
                    console.error(useAppStore().app_language == "hu" ? err.hu : err.en)
                )
            } else {
                alert(useAppStore().app_language == 'hu' ? validation.message : validation.messageEn);
            }
        },
        getRecipeById(id:number){
            return recipesService.getRecipeById(id)
                .then((res: any)=>{
                    this.viewedRecipe = res.data;
                }).catch((err: any)=>
                    Promise.reject(useAppStore().app_language == "hu" ? err.hu : err.en)
                )
        },
        updateQuantity(data: IStoredItem, method: string){
            if (data.quantity == 0) {
                return storageService.deleteItemFromStorage(data)
                .then((res: any)=>{
                    this.status.message = "";
                    this.status.messageEn = "";
                    this.storedItems.splice(this.storedItems.findIndex(x=>  x.userId == data.userId && x.itemId == data.itemId), 1);
                    this.storedItemsAllLength--;
                    sessionStorage.setItem("storageMaxLength", `${this.storedItemsAllLength}`);
                    if (this.storedItems.length == 0) {
                        this.loadStoredItemsPaginated(0, this.paginatorValues.to - this.paginatorValues.from);
                        useAppStore().paginatorLastElementDeleted = true;
                    }
                })
                .catch((err: any)=> {
                    this.status.message = err.hu;
                    this.status.message = err.en;
                })
            }
            return storageService.updateStoredItemQuantity(data)
                .then((res: any)=>{
                    this.status.message = "";
                    this.status.messageEn = "";
                    if(method == "add" && (res.data.storedItem.typeId == this.selectedItemtype || this.selectedItemtype == 0)){
                        if(this.storedItems.length != 0){
                            const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                            if(this.storedItems.length < pagiDiff)
                                this.storedItems.push(res.data);
                        } else
                            this.storedItems.push(res.data);
                        if (this.paginatorValues.from == 0 && this.paginatorValues.to >= this.storedItemsAllLength){
                            window.location.reload();
                        }
                        this.storedItemsAllLength++;
                        sessionStorage.setItem("storageMaxLength", `${this.storedItemsAllLength}`);
                    } else {
                        this.storedItems[this.storedItems.findIndex(x=>  x.userId == data.userId && x.itemId == data.itemId)] = res.data;
                    }
                })
                .catch((err: any)=> {
                    this.status.message = err.hu;
                    this.status.message = err.en;
                })
        }
    }
});