import Axios from "axios";

const instance = Axios.create({
    baseURL: import.meta.env.BACKEND_URL, //backend url-je
    headers: {
        'Content-Type': 'application/json'
    }
})

export default instance