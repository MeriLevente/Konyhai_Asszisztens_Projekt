import { useUserStore } from "@/stores/userstore"
import axios from "axios"

// a védett url hívásakor megnézi, hogy jogusultak vagyunk-e (szerep megfelel-e)
axios.interceptors.request.use((config) => {
    const token = useUserStore().user.token;
    const senderRole = useUserStore().user.role
    if (token && senderRole) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})