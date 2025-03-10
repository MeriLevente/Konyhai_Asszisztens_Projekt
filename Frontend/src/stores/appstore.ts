import {defineStore} from "pinia";

export const useAppStore = defineStore('appStore', {
    state: () => ({
        app_language : ''
    })
});