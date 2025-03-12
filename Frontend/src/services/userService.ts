import type IUser from "@/models/User";
import instance from "./dataService";

export default {
    register(data: IUser){
        return instance.post('/users/register', data)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response) // return Promise.reject() => a másik oldalon a catch ágba fut
                }) //hiba történt
    },
    login(data: IUser){
        return instance.put('/users/login', data)
                .then((res)=>{
                    return res
                })
                .catch((err)=>{
                    return Promise.reject(err.response)
        })
    },
    logout(id: number){
        return instance.put(`/users/logout/${id}`)
                .then(()=>{
                    return
                })
                .catch(()=>{
                    return Promise.reject()
                })
    }
}