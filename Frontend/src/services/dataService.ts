import Axios from "axios";

const instance = Axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
})

instance.interceptors.request.use((config)=>{
    const token: string | null = sessionStorage.getItem("token");
    const lang: string | null = localStorage.getItem('lang');
    if (token) {
        config.headers["Authorization"] = `Bearer ${token.trim()}`;
    }
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }
    return config;
});

instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(
        error.response.data
      );
    }
  );

export default instance