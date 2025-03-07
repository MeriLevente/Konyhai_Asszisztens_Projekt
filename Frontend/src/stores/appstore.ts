import i18n from "@/translations";
import {defineStore} from "pinia";

export const useAppStore = defineStore('appStore', {
    state: () => ({
        app_language : i18n.global.locale.value
    })
});