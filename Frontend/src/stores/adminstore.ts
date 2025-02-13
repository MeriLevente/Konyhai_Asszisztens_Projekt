import type IType from "@/models/Type";
import { defineStore } from "pinia";

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        types: <IType[]> [{
            
        }],
        type_error: "" //hiba a típus formnál vagy törlésnél
    }),
    getters: {
        storeTypes(): IType[] {
            return this.types = [{id: 1, nameHU: "Zöldségek", nameEN: "Vegetables", image: "@/assets/images/fruits.jpg"},{id: 2, nameHU: "Gyümölcsök", nameEN: "Fruits", image: "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg?w=400&h=300&c=crop"}]
        }
    }
});