import { useUserStore } from "@/stores/userstore"
import { useAppStore } from "@/stores/appstore";
import axios from "axios"

// a védett url hívásakor megnézi, hogy jogusultak vagyunk-e (szerep megfelel-e)
axios.interceptors.request.use((config) => {
  if(config){
    const token = useUserStore().user?.token;
    const senderRole = useUserStore().user?.role;
    if(token){
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Accept-Language'] = `${useAppStore().app_language == 'hu' ? 'hu' : 'en'}`
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  } else{
    return Promise.reject();
  }
})