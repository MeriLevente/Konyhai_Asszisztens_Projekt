import {defineStore} from "pinia";

export const useAppStore = defineStore('appStore', {
    state: () => ({
        visual_mode : {
            mode: "light"
        }
    })
});