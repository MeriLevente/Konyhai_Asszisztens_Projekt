import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, //backend url-je
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // 'Authorization': `Bearer ${await sessionStorage.getItem("token") ?? ""}`,
        // 'Accept-Language': await localStorage.getItem('lang') ?? ""
    }
})

instance.interceptors.request.use((config)=>{
    const token: string | null = sessionStorage.getItem("token");
    const lang: string | null = localStorage.getItem('lang');
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }
    return config;
})

export default instance