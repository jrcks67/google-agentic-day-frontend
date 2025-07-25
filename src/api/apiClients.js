import { createApiClient } from "./apiFactory"

export const chatApi = createApiClient("/api/chat")
export const chatWSApi = createApiClient("/ws/chat")
export const authApi = createApiClient("/api/auth")
export const uploadApi = createApiClient("/api/upload")
