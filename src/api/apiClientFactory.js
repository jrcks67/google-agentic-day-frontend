import axios from 'axios'
import { applyAuthInterceptor } from "./interceptors/authInterceptor"


export const createApiClient = (baseUrl) => {
    const instance = axios.create({
        baseURL: baseUrl,
        timeout: 1000,
        headers: {
            "Content-Type": "application/json"
        }
    })

    applyAuthInterceptor(instance)
    return instance
}