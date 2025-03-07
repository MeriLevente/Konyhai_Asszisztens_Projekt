import type IUser from "@/models/User";
import instance from "./dataService";

export default {
    register(data: IUser){
        return instance.post('/register', data)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response) // return Promise.reject() => a másik oldalon a catch ágba fut
                }) //hiba történt
    },
    login(data: IUser){
        return instance.post('/login', data)
                .then((res)=>{
                    return res
                })
                .catch((err)=>{
                    return Promise.reject(err.response)
        })
    },
    logout(token: string){
        return instance.post('/logout')
                .then((res)=>{
                    return res.data
                })
                .catch(()=>{
                    return Promise.reject()
                })
    }
}