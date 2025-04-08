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
import type Ingredient from "@/models/Ingredient";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: <ILoggedInUser | undefined>{

        },
        status : {
            loggedIn: false,
            message: '',
            messageEn: '',
            confirmPassword: ''
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
        },
        storageLoading: false
    }),
    actions: {
        hideError() {
            this.status.message = '';
            this.status.messageEn = '';
        },
        login(data: IUser) {
            let validation: IFormResponse = UserValidation.loginIsValid(data.email, data.password);
            if (!validation.isError) {
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
                        .catch((err: any) => {
                            this.status.message = err.hu;
                            this.status.messageEn = err.en;
                            return Promise.reject();
                        });
            } else {
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
                return Promise.reject();
            };
        },
        register(data: IUser) {
            let validation: IFormResponse = UserValidation.registerIsValid(
                data.name!, data.email, data.password, this.status.confirmPassword
            );
            if (!validation.isError) {
                return userService.register(data, data.role)
                            .then((res: any) => {
                                this.status.loggedIn = true;
                                this.hideError();
                                this.status.confirmPassword = "";
                                if (data.role == "user") {
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
                                };
                            })
                            .catch((err: any) => {
                                this.status.message = err.hu;
                                this.status.messageEn = err.en;
                                return Promise.reject();
                            });
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
                return Promise.reject();
            };
        },
        logout() {
            return userService.logout(this.user!.id!)
                .then(() => {
                    this.status.loggedIn = false;
                    this.user = undefined;
                    DataLoader.clearSessionStorage();
                })
                .catch(() => {
                    this.status.loggedIn = false;
                    this.user = undefined;
                    DataLoader.clearSessionStorage();
                });
        },
        getStoredItems(loadIntoStore: boolean) {
            return storageService.getStoredItems()
                .then((res: any) => {
                    if (loadIntoStore)
                        this.storedItems = res.data;
                    else
                        return res.data;
                }).catch((err: any) =>
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en)
                );
        },
        loadStoredItemsPaginated(from: number, to: number) {
            return storageService.getStoredItemsPaginated(from, to)
                .then((res: any) => {
                    this.paginatorValues.to = to;
                    this.paginatorValues.from = from;
                    sessionStorage.setItem("paginator-from", `${Number(from)}`);
                    sessionStorage.setItem("paginator-to", `${Number(to)}`);
                    this.storedItems = res.data;
                }).catch((err: any) => {
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getStorageLength() {
            return storageService.getStorageLength()
                .then((res: any) => {
                    this.storedItemsAllLength = res.data.length;
                    sessionStorage.setItem("storageMaxLength", `${res.data.length}`);
                    return res.data.length;
                })
                .catch((err: any) => {
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getStoredItemsByTypeId(typeId: number) {
            this.storageLoading = true;
            return storageService.getStoredItemsByTypeId(typeId)
                .then((res: any) => {
                    this.storageLoading = false;
                    this.storedItems = res.data;
                }).catch((err: any) => {
                    this.storageLoading = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getStoredItemsBySearch(typeId: number | null, sWord: string | undefined) {
            this.storageLoading = true;
            return storageService.getStoredItemsBySearch(typeId, sWord!)
                .then((res: any) => {
                    this.storageLoading = false;
                    this.storedItems = res.data.filter((x: IStoredItem) => x.userId == this.user?.id);
                })
                .catch((err: any) => {
                    this.storageLoading = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        getRecipeById(id:number) {
            this.storageLoading = true;
            return recipesService.getRecipeById(id)
                .then((res: any)=>{
                    this.storageLoading = false;
                    this.viewedRecipe = res.data;
                }).catch((err: any)=>{
                    this.storageLoading = false;
                    this.status.message = err.hu;
                    this.status.messageEn = err.en;
                });
        },
        updateQuantity(data: IStoredItem, method: string) {
            if (data.quantity == 0) {
                return storageService.deleteItemFromStorage(data)
                .then(() => {
                    this.status.message = "";
                    this.status.messageEn = "";
                    this.storedItems.splice(this.storedItems.findIndex(x=>  x.userId == data.userId && x.itemId == data.itemId), 1);
                    this.storedItemsAllLength--;
                    sessionStorage.setItem("storageMaxLength", `${this.storedItemsAllLength}`);
                    if (this.storedItems.length == 0 && this.showAllTrig) {
                        this.loadStoredItemsPaginated(0, this.paginatorValues.to - this.paginatorValues.from)
                            .then(() => {
                                useAppStore().paginatorLastElementDeleted = true;
                                window.location.reload();
                            }).
                            catch((err: any) => {
                                console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                            });
                    };
                })
                .catch((err: any) => {
                    this.status.message = err.hu;
                    this.status.message = err.en;
                });
            }
            return storageService.updateStoredItemQuantity(data)
                .then((res: any) => {
                    this.status.message = "";
                    this.status.messageEn = "";
                    if (method == "add" && (res.data.storedItem.typeId == this.selectedItemtype || this.selectedItemtype == 0)) {
                        if (this.storedItems.length != 0) {
                            const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                            if (this.storedItems.length < pagiDiff) {
                                this.storedItems.push(res.data);
                            };
                        } else {
                            this.storedItems.push(res.data);
                        };    
                        if (this.showAllTrig && (this.paginatorValues.from == 0 && this.paginatorValues.to == this.storedItemsAllLength)) {
                            window.location.reload();
                        };
                    } else {
                        this.storedItems[this.storedItems.findIndex(x=>  x.userId == data.userId && x.itemId == data.itemId)] = res.data;
                    };
                })
                .catch((err: any) => {
                    this.status.message = err.hu;
                    this.status.message = err.en;
                });
        },
        getRecipeIngredientsInMyKitchen(ingredients: IStoredItem[]) {
            this.storageLoading = true;
            let myIngredients: IStoredItem[] = [];
            ingredients.forEach(x => {
                const myItem: IStoredItem | undefined = this.storedItems.find(y => y.storedItem?.id == x.itemId);
                if (myItem) {
                    myIngredients.push(myItem);
                } else {
                    myIngredients.push({itemId: x.itemId, quantity: 0, userId: this.user!.id!});
                };
            });
            return myIngredients;
        }
    }
});