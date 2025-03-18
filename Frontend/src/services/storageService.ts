
import { useUserStore } from "@/stores/userstore";
import instance from "./dataService";

export default {
    getStoredItems(){
        return instance.get(`/storage/${useUserStore().user?.id}`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response)
        })
    },
    getStoredItemsByTypeId(typeId: number){
        return instance.get(`/storage/${useUserStore().user?.id}/${typeId}`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response)
        })
    },
    getStoredItemsBySearch(typeId: number | null, sWord: string){
        const routeEnd: string = `${!typeId ? `search/${sWord}` : `${typeId}/search/${sWord}`}`
        return instance.get(`/storage/${useUserStore().user?.id}/${routeEnd}`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err.response)
        })
    }
}