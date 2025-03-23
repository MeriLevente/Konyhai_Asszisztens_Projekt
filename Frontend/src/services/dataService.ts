import Axios from "axios";

const instance = Axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, //backend url-je
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${await sessionStorage.getItem("token") ?? ""}`,
        'Accept-Language': localStorage.getItem('lang') ?? ""
    }
})

export default instance