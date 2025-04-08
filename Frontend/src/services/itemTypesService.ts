import type IType from "@/models/Type";
import instance from "./dataService";

export default {
    getTypes(){
        return instance.get('/types')
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getAllTypesLength(){
        return instance.get('/types/length')
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            console.error(err);
        });
    },
    getPaginated(from: number, to: number){
        return instance.get(`/types/from/${from}/to/${to}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    getSearchedTypes(search: string){
        return instance.get(`/types/search/${search}`)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    addType(data: IType){
        return instance.post('/types', data)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    updateType(data: IType){
        return instance.put(`/types`, data)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
    deleteType(data: IType){
        return instance.delete(`/types/${data.id}`)
        .catch((err: any) => {
            return Promise.reject(err);
        });
    },
}