import type ILoggedInUser from "@/models/LoggedInUser";
import type IUser from "@/models/User";
import userService from "@/services/userService";
import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        status : {
            loggedIn: false,
            message: ''
        },
        user: <ILoggedInUser>{

        }
    }),
    actions: {
        login(data: IUser) {
            return userService.login(data)
                .then((res: any) => {
                    this.status.loggedIn = true
                    this.status.message = ""
                    this.user = res.data.data // a backendről érkező user IIT LEHET PROBLÉMA
                    localStorage.setItem("user", JSON.stringify(this.user)) //csak stringet lehet tárolni
                })
                .catch((err: any)=>{
                    this.status.loggedIn = false
                    this.status.message = err.message // a backend szerverről érkező hibaüzenet ITT LEHET PROBLÉMA
                    this.user = {name: "", token: "", token_valid_to: null, id: null, role: ""}
                    return Promise.reject()
                })
        },
        register(data: IUser){
            return userService.register(data)
                .then((res: any) => {
                    this.status.loggedIn = true
                    this.status.message = ""
                    this.user = res.data.data // a backendről érkező user IIT LEHET PROBLÉMA
                    localStorage.setItem("user", JSON.stringify(this.user)) //csak stringet lehet tárolni
                })
                .catch((err: any)=>{
                    this.status.loggedIn = false
                    this.status.message = err.message // a backend szerverről érkező hibaüzenet ITT LEHET PROBLÉMA
                    this.user = {name: "", token: "", token_valid_to: null, id: null, role: ""}
                    return Promise.reject()
                })
        }
    }
});