import type Item from "@/models/Item";
import instance from "./dataService";

export default {
    getItems(){
        return instance.get('/items')
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getItemsByType(typid: number){
        return instance.get(`/items/typeid/${typid}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getAllLength(){
        return instance.get('/items/length')
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getPaginated(from: number, to: number){
        return instance.get(`/items/from/${from}/to/${to}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getSearchedItems(search: string){
        return instance.get(`/items/search/${search}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    addItem(data: Item){
        return instance.post('/items', data)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    updateItem(data: Item){
        return instance.put(`/items`, data)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    deleteItem(data: Item){
        return instance.delete(`/items/${data.id}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    }
};