import type IType from "@/models/Type";
import itemTypesService from "@/services/itemTypesService";
import TypeValidation from "@/utils/TypeValidation";
import { defineStore } from "pinia";

export const useTypeStore = defineStore('typeStore', {
    state: () => ({
        types: <IType[]> [{

        }],
        type_error: {
            hu: "",
            en: ""
        }
    }),
    actions: {
        getTypes(){
            itemTypesService.getTypes()
                .then((res: any)=>{
                    this.types = res.data;
                    return res.data;
                }
                )
                .catch(()=>{
                    return Promise.reject();
                })
        },
        saveType(data: IType){
            let validation = TypeValidation.TypeAllFilled(data.name, data.name_EN, data.image);
            if (!validation.isError) {
                if (data.id) {
                    return itemTypesService.updateType(data)
                            .then((res: any)=>{
                                this.type_error.hu = "";
                                this.type_error.en = "";
                                this.types[this.types.findIndex(x=> x.id == data.id)] = res.data;
                            })
                            .catch((err: any)=>{
                                this.type_error.hu = err.hu;
                                this.type_error.en = err.en;
                                return Promise.reject();
                            });;
                } else {
                    return itemTypesService.addType(data)
                            .then((res: any)=>{
                                this.type_error.hu = "";
                                this.type_error.en = "";
                                this.types.push(res.data);
                            })
                            .catch((err: any)=>{
                                this.type_error.hu = err.hu;
                                this.type_error.en = err.en;
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
                return itemTypesService.deleteType(data)
                .then(()=>{
                    this.type_error.hu = "";
                    this.type_error.en = "";
                    this.types.splice(this.types.indexOf(data), 1);
                })
                .catch((err: any)=>{
                    this.type_error.hu = err.hu;
                    this.type_error.en = err.en;
                    return Promise.reject();
                });
            } else {
                this.type_error.hu = "Sikertelen törlés";
                this.type_error.en = "Delete failed!";
                return Promise.reject();
            }
        }}
});