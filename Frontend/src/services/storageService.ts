import { useUserStore } from "@/stores/userstore";
import instance from "./dataService";
import type IStoredItem from "@/models/StoredItem";

export default {
    getStoredItems(){
        return instance.get(`/storage/${useUserStore().user?.id}`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err)
        })
    },
    getStoredItemsPaginated(from: number, to: number){
        return instance.get(`/storage/${useUserStore().user?.id}/from/${from}/to/${to}`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err)
        })
    },
    getStorageLength(){
        return instance.get(`/storage/${useUserStore().user?.id}/length`)
                .then((res: any)=>{
                    return res
                })
                .catch((err: any)=>{
                    return Promise.reject(err)
        })
    },
    getStoredItemsByTypeId(typeId: number){
        return instance.get(`/storage/${useUserStore().user?.id}/${typeId}`)
                .then((res: any)=>{
                    return res;
                })
                .catch((err: any)=>{
                    return Promise.reject(err);
        });
    },
    getStoredItemsBySearch(typeId: number | null, sWord: string){
        const routeEnd: string = `${!typeId ? `search/${sWord}` : `${typeId}/search/${sWord}`}`
        return instance.get(`/storage/${useUserStore().user?.id}/${routeEnd}`)
                .then((res: any)=>{
                    return res;
                })
                .catch((err: any)=>{
                    return Promise.reject(err);
        });
    },
    updateStoredItemQuantity(data: IStoredItem){
        return instance.post("storage", data)
                .then((res: any)=>{
                    return res;
                })
                .catch((err: any)=>{
                    return Promise.reject(err);
                })
    },
    deleteItemFromStorage(data: IStoredItem){
        return instance.delete("storage", {data})
                .then((res: any)=>{
                    return res;
                })
                .catch((err: any)=>{
                    return Promise.reject(err);
                })
    }
}