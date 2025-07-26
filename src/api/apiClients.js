import { createApiClient, createPublicApiClient } from "./apiClientFactory";
import { initializeAuthToken } from "./interceptors/authInterceptor";

// Initialize auth token on app load
initializeAuthToken();

/**
 * Authenticated API client
 * Used for protected endpoints that require authentication
 */
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

/**
 * Public API client
 * Used for public endpoints like auth (signup, login, password reset)
 */
export const publicApiClient = createPublicApiClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

/**
 * Chat API client
 * Base client for chat-related API endpoints (requires authentication)
 */
export const chatClient = createApiClient({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/chat`,
});

/**
 * Auth API client
 * Base client for authentication endpoints (public)
 */
export const authClient = createPublicApiClient({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth`,
});

// Add more API clients as needed for different resource types
