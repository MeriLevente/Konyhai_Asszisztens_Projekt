import type IUser from "@/models/User";
import instance from "./dataService";

export default {
    register(data: IUser){
        return instance.post('/users/register', data)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err)
        });
    },
    login(data: IUser){
        return instance.put('/users/login', data)
                .then((res)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err)
        })
    },
    logout(id: number){
        return instance.put(`/users/logout/${id}`)
                .then(()=>{
                    return
                })
                .catch((err: any)=>{
                    console.error(err)
        })
    }
}