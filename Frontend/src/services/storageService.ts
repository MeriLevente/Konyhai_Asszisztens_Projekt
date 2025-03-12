
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
    }
}