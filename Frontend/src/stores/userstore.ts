import type { UserModel } from "@/models/UserModel";
import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        status : {
            loggedIn: false,
            message: ''
        },
        user: <UserModel>{

        }
    })
});