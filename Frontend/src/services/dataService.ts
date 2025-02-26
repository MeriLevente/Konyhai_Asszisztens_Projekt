
import Axios from "axios";

const instance = Axios.create({
    baseURL: import.meta.env.BACKEND_URL, //backend url-je
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default instance