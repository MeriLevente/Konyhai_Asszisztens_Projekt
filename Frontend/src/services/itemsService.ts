import type Item from "@/models/Item"
import instance from "./dataService"

export default {
    getItems(){
        return instance.get('/items')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    getItemsByType(typid: number){
        return instance.get(`/items/typeid${typid}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    getAllLength(){
        return instance.get('/items/length')
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    getPaginated(from: number, to: number){
        return instance.get(`/items/from/${from}/to/${to}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    getSearchedItems(search: string){
        return instance.get(`/items/search/${search}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err)
        })
    },
    addItem(data: Item){
        return instance.post('/items', data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    updateItem(data: Item){
        return instance.post(`/items`, data)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
    deleteItem(data: Item){
        return instance.post(`/items/${data.itemId}`)
        .then((res: any)=>{
            return res
        })
        .catch((err: any)=>{
            return Promise.reject(err.response)
        })
    },
}