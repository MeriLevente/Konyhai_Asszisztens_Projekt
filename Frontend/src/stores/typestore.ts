import type IType from "@/models/Type";
import itemTypesService from "@/services/itemTypesService";
import TypeValidation from "@/utils/TypeValidation";
import { defineStore } from "pinia";
import { useAppStore } from "./appstore";
import SearchValidation from "@/utils/SearchValidation";

export const useTypeStore = defineStore('typeStore', {
    state: () => ({
        types: <IType[]> [{

        }],
        typesError: {
            hu: "",
            en: ""
        },
        loadingTypes: false,
        typesAllLength: Number(sessionStorage.getItem("typesMaxLength")) ?? 0,
        paginatorValues: {
            from: Number(sessionStorage.getItem("paginator-from")) ?? 0,
            to: Number(sessionStorage.getItem("paginator-to")) ?? 6
        }
    }),
    actions: {
        getTypes() {
            this.loadingTypes = true;
            itemTypesService.getTypes()
                .then((res: any) => {
                    this.types = res.data;
                    this.loadingTypes = false;
                    return res.data;
                })
                .catch((err: any) => {
                    this.loadingTypes = false;
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                    return Promise.reject();
                });
        },
        getAllTypesLength() {
            return itemTypesService.getAllTypesLength()
                .then((res: any) => {
                    this.typesAllLength = res.data.length;
                    sessionStorage.setItem("typesMaxLength", `${res.data.length}`);
                    return res.data.length;
                }
                )
                .catch((err: any) => {
                    console.error(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        },
        loadPaginated(from: number, to: number) {
            return itemTypesService.getPaginated(from, to).
                then((res: any) => {
                    this.paginatorValues.to = to;
                    this.paginatorValues.from = from;
                    sessionStorage.setItem("paginator-from", `${Number(from)}`);
                    sessionStorage.setItem("paginator-to", `${Number(to)}`);
                    this.types = res.data;
                })
                .catch((err: any) => {
                    return Promise.reject(err);
                });
        },
        searchTypes(search: string) {
            let validation = SearchValidation.searchedWordIsValid(search);
            if(!validation.isError){
                return itemTypesService.getSearchedTypes(search).
                    then((res: any) => {
                        this.types = res.data;
                    })
                    .catch((err: any) => {
                        return Promise.reject(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                    });
            } else {
                return Promise.reject(useAppStore().appLanguage == "hu" ? validation.message : validation.messageEn);
            };
        },
        saveType(data: IType) {
            let validation = TypeValidation.typeAllFilled(data.name, data.name_EN, data.image);
            if (!validation.isError) {
                if (data.id) {
                    return itemTypesService.updateType(data)
                            .then((res: any) => {
                                this.typesError.hu = "";
                                this.typesError.en = "";
                                this.types[this.types.findIndex(x=> x.id == data.id)] = res.data;
                            })
                            .catch((err: any) => {
                                this.typesError.hu = err.hu;
                                this.typesError.en = err.en;
                                return Promise.reject();
                            });
                } else {
                    return itemTypesService.addType(data)
                            .then((res: any) => {
                                this.typesError.hu = "";
                                this.typesError.en = "";
                                const pagiDiff: number = this.paginatorValues.to - this.paginatorValues.from;
                                if (this.types.length < pagiDiff)
                                    this.types.push(res.data);
                                if (this.paginatorValues.from == 0 && this.paginatorValues.to == this.typesAllLength) {
                                    window.location.reload();
                                }
                                this.typesAllLength += 1;
                                sessionStorage.setItem("typesMaxLength", `${this.typesAllLength}`);  
                            })
                            .catch((err: any) => {
                                this.typesError.hu = err.hu;
                                this.typesError.en = err.en;
                                return Promise.reject();
                            });
                }
            } else {
                this.typesError.hu = validation.message!;
                this.typesError.en = validation.messageEn!;
                return Promise.reject();
            }
        },
        deleteType(data: IType) {
            return itemTypesService.deleteType(data)
                .then(() => {
                    this.typesAllLength -= 1;
                    sessionStorage.setItem("typesMaxLength", `${this.typesAllLength}`);
                    this.types.splice(this.types.indexOf(data), 1);
                    if (this.types.length == 0) {
                        this.loadPaginated(0, this.paginatorValues.to - this.paginatorValues.from);
                        useAppStore().paginatorLastElementDeleted = true;
                    };
                })
                .catch((err: any) => {
                    return Promise.reject(useAppStore().appLanguage == "hu" ? err.hu : err.en);
                });
        }
    }
});