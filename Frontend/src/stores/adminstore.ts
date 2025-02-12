import type IType from "@/models/Type";
import { defineStore } from "pinia";

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        types: <IType[]> [{
            
        }],
    }),
    getters: {
        storeTypes(): IType[] {
            return this.types = [{id: 1, nameHU: "Zöldségek", nameEN: "Vegetables", image: ""},{id: 2, nameHU: "Gyümölcsök", nameEN: "Fruits", image: ""}]
        }
    }
});