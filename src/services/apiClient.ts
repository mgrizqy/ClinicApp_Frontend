import axios, {AxiosInstance} from "axios"

const baseURL : string =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const apiClient : AxiosInstance = axios.create({
    baseURL:baseURL,
    withCredentials: true,
    headers:{
        "Content-Type": "application/json",
    }
})

export default apiClient
