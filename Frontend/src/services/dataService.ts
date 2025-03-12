
import Axios from "axios";

const instance = Axios.create({
    baseURL: "http://localhost:5098/api", //backend url-je
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'        
    }
})

export default instance