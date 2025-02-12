import type IType from "@/models/Type";
import { defineStore } from "pinia";

export const useAdminStore = defineStore('userStore', {
    state: () => ({
        types: <IType[]> [{
            
        }],
        types_empty: {
            isEmpty: false
        }
    }),
    getters: {
        storeTypes(): IType[] {
            this.types.push({id: 1, nameHU: "Zöldségek", nameEN: "Vegetables", image: ""});
            return this.types
        }
    }
});