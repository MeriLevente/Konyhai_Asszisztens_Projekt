import type Item from "@/models/Item";
import adminService from "@/services/adminService";
import ItemValidation from "@/utils/ItemValidation";
import { defineStore } from "pinia";

export const useItemStore = defineStore('itemStore', {
    state: () => ({
        items: <Item[]> [{

        }],
        items_error: {
            hu: "",
            en: ""
        },
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
                                this.items.push(res);
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
        }
    }
});