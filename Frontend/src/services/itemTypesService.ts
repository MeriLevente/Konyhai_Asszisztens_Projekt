import type IType from "@/models/Type"
import instance from "./dataService"

export default {
    getTypes(){
        return instance.get('/types')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    addType(data: IType){
        return instance.post('/types', data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    updateType(data: IType){
        return instance.put(`/types`, data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    deleteType(data: IType){
        return instance.delete(`/types/${data.id}`)
        .then(()=>{
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
}