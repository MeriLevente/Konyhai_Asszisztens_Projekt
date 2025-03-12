import type IFormResponse from "@/models/FormResponse";
import type ILoggedInUser from "@/models/LoggedInUser";
import type StoredItem from "@/models/StoredItem";
import type IUser from "@/models/User";
import storageService from "@/services/storageService";
import userService from "@/services/userService";
import UserValidation from "@/utils/UserValidation";
import {defineStore} from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: <ILoggedInUser | undefined>{

        },
        status : {
            loggedIn: false,
            message: '',
            messageEn: '',
            confirm_password: ''
        },
        storedItems: <StoredItem[]> [

        ]
    }),
    actions: {
        hideError() {
            this.status.message = '';
            this.status.messageEn = '';
        },
        login(data: IUser) {
            let validation: IFormResponse = UserValidation.LoginIsValid(data.email, data.password)
            if(!validation.isError){
                return userService.login(data)
                        .then((res: any) => {
                            this.status.loggedIn = true;
                            this.hideError();
                            this.user = res.data;
                            localStorage.setItem("user", JSON.stringify(this.user))
                        })
                        .catch((err: any)=>{
                            this.status.loggedIn = false
                            this.status.message = err.data.hu
                            this.status.messageEn = err.data.en
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
                                this.hideError();
                                this.status.confirm_password = "";
                                this.user = res.data;
                                localStorage.setItem("user", JSON.stringify(this.user));
                            })
                            .catch((err: any)=>{
                                this.status.loggedIn = false;
                                this.status.message = err.data.hu;
                                this.status.messageEn = err.data.en;
                                this.user = {name: "", token: "", id: null, role: ""};
                                return Promise.reject();
                            })
            } else{
                this.status.message = validation.message!;
                this.status.messageEn = validation.messageEn!;
                return Promise.reject();
            }
        },
        logout(){
            return userService.logout(this.user!.id!)
                .then(()=>{
                    this.status.loggedIn = false;
                    this.user = undefined;
                    localStorage.removeItem("user");
                })
                .catch((err: any)=>{
                    this.status.message = err.data.hu;
                    this.status.messageEn = err.data.en;
                    return Promise.reject();
                })
        },
        getStoredItems(){
            return storageService.getStoredItems()
                .then((res: any)=>{
                    this.storedItems = res.data;
                }).catch((err)=>
                    console.log(err)
                )
        }
    }
});