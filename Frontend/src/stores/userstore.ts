import type IFormResponse from "@/models/FormResponse";
import type ILoggedInUser from "@/models/LoggedInUser";
import type IUser from "@/models/User";
import userService from "@/services/userService";
import UserValidation from "@/utils/UserValidation";
import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        status : {
            loggedIn: false,
            message: '',
            messageEn: '',
            confirm_password: ''
        },
        user: <ILoggedInUser>{

        }
    }),
    actions: {
        login(data: IUser) {
            let validation: IFormResponse = UserValidation.LoginIsValid(data.email, data.password)
            if(!validation.isError){
                return userService.login(data)
                        .then((res: any) => {
                            this.status.loggedIn = true;
                            this.status.message = "";
                            this.status.messageEn = "";
                            this.user = res.data.data; // a backendről érkező user IIT LEHET PROBLÉMA
                            localStorage.setItem("user", JSON.stringify(this.user)) //csak stringet lehet tárolni
                        })
                        .catch((err: any)=>{
                            this.status.loggedIn = false
                            this.status.message = err.message
                            this.status.messageEn = err.messageEn // a backend szerverről érkező hibaüzenet ITT LEHET PROBLÉMA
                            this.user = {name: "", token: "", id: null, role: ""}
                            return Promise.reject()
                        })
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
                return Promise.reject();
            }
        },
        register(data: IUser){
            let validation: IFormResponse = UserValidation.RegisterIsValid(data.name!, data.email, data.password, this.status.confirm_password)
            if(!validation.isError){
                return userService.register(data)
                            .then((res: any) => {
                                this.status.loggedIn = true;
                                this.status.message = "";
                                this.status.messageEn = "";
                                this.status.confirm_password = "";
                                this.user = res.data.data; // a backendről érkező user IIT LEHET PROBLÉMA
                                localStorage.setItem("user", JSON.stringify(this.user)); //csak stringet lehet tárolni
                            })
                            .catch((err: any)=>{
                                this.status.loggedIn = false;
                                this.status.message = err.message; // a backend szerverről érkező hibaüzenet ITT LEHET PROBLÉMA
                                this.status.messageEn = err.messageEn; // a backend szerverről érkező hibaüzenet ITT LEHET PROBLÉMA
                                this.user = {name: "", token: "", id: null, role: ""};
                                return Promise.reject();
                            })
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
                return Promise.reject();
            }
        }
    }
});