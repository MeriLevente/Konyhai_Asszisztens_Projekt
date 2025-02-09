import type IUser from "@/models/User";
import Axios from "./dataService";

export default {
    register(data: IUser){
        return Axios.post('/register', data)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response) // return Promise.reject() => a másik oldalon a catch ágba fut
                }) //hiba történt
    },
    login(data: IUser){
        return Axios.post('/login', data)
                .then((res)=>{
                    return res
                })
                .catch((err)=>{
                    return Promise.reject(err.response)
        })
    }
}