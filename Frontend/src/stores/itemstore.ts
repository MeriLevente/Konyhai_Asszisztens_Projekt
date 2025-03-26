import type Item from "@/models/Item";
import adminService from "@/services/adminService";
import itemsService from "@/services/itemsService";
import ItemValidation from "@/utils/ItemValidation";
import SearchValidation from "@/utils/SearchValidation";
import { defineStore } from "pinia";
import { useAppStore } from "./appstore";

export const useItemStore = defineStore('itemStore', {
    state: () => ({
        items: <Item[]> [{

        }],
        items_error: {
            hu: "",
            en: ""
        },
        itemsAllLength: Number(sessionStorage.getItem("itemsMaxLength")) ?? 0,
        paginatorValues: {
            from: Number(sessionStorage.getItem("paginator-from")) ?? 0,
            to: Number(sessionStorage.getItem("paginator-to")) ?? 6
        }
    }),
    actions: {
        getItems(){
            adminService.getItems()
                .then((res: any)=>{
                    this.items = res.data;
                    sessionStorage.setItem("items", JSON.stringify(res.data))
                    return res.data;
                }
                )
                .catch((err:any)=>{
                    console.log(err);
                })
        },
        getAllItemsLength(){
            return itemsService.getAllLength()
                .then((res: any)=>{
                    this.itemsAllLength = res.data.length
                    sessionStorage.setItem("itemsMaxLength", `${res.data.length}`);
                    return res.data.length;
                })
                .catch(()=>{
                    return Promise.reject();
                })
        },
        getItemsByTypeId(typeid: number){
            adminService.getItemsByType(typeid)
                .then((res: any)=>{
                    this.items = res.data;
                }
                )
                .catch((err:any)=>{
                    console.error(err);
                })
        },
        loadItemsPaginated(from: number, to: number){
            return itemsService.getPaginated(from, to).
                then((res: any)=>{
                    this.paginatorValues.to = to;
                    this.paginatorValues.from = from;
                    sessionStorage.setItem("paginator-from", `${Number(from)}`);
                    sessionStorage.setItem("paginator-to", `${Number(to)}`);
                    this.items = res.data;
            })
            .catch((err: any)=>{
                return Promise.reject(useAppStore().app_language == "hu" ? err.hu : err.en);
            })
        },
        searchItems(search: string){
            let validation = SearchValidation.SearchedWordIsValid(search);
            if(!validation.isError){
                return itemsService.getSearchedItems(search).
                    then((res: any)=>{
                        this.items = res.data;
                    })
                    .catch((err: any)=>{
                        return Promise.reject(useAppStore().app_language == "hu" ? err.hu : err.en);
            })
            } else {
                return Promise.reject(useAppStore().app_language == "hu" ? validation.message : validation.messageEn);
            }
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
                                const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                                if(this.items.length < pagiDiff)
                                    this.items.push(res.data);
                                this.itemsAllLength += 1;
                                sessionStorage.setItem("itemsMaxLength", `${this.itemsAllLength}`);
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
                    this.itemsAllLength -= 1;
                    sessionStorage.setItem("itemsMaxLength", `${this.itemsAllLength}`);
                    this.items.splice(this.items.indexOf(data), 1);
                    if (this.items.length == 0) {
                        this.loadItemsPaginated(0, this.paginatorValues.to - this.paginatorValues.from);
                        useAppStore().paginatorLastElementDeleted = true;
                    }
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
        }
    }
});