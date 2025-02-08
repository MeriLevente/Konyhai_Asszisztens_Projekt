import type ILoggedInUser from "@/models/LoggedInUser";
import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        status : {
            loggedIn: false,
            message: ''
        },
        user: <ILoggedInUser>{

        }
    })
});