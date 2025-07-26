import axios from "axios";
import { 
  authRequestInterceptor, 
  authResponseInterceptor, 
  authErrorInterceptor 
} from "./interceptors/authInterceptor";

/**
 * Creates an Axios client instance with configured defaults and interceptors
 * 
 * @param {Object} options - Configuration options for the client
 * @param {String} options.baseURL - The base URL for the client
 * @param {Number} options.timeout - Request timeout in milliseconds
 * @param {Boolean} options.withCredentials - Whether to include cookies with requests
 * @param {Boolean} options.useAuth - Whether to use auth interceptors
 * @param {Object} options.headers - Default headers to include with requests
 * @returns {Object} Configured Axios instance
 */
export const createApiClient = (options = {}) => {
  const defaultOptions = {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    timeout: 30000, // 30 seconds
    withCredentials: true,
    useAuth: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  };

  // Merge provided options with defaults
  const clientOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    }
  };

  // Create axios instance
  const client = axios.create(clientOptions);

  // Add request logger for development
  if (import.meta.env.DEV) {
    client.interceptors.request.use((config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
      return config;
    });
  }

  // Apply auth interceptors if needed
  if (clientOptions.useAuth) {
    client.interceptors.request.use(authRequestInterceptor);
    client.interceptors.response.use(authResponseInterceptor, authErrorInterceptor);
  }

  // Response logger for development
  if (import.meta.env.DEV) {
    client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data || error);
        return Promise.reject(error);
      }
    );
  }

  return client;
};

/**
 * Creates a public API client that doesn't require authentication
 * Used for signup, login, password reset, etc.
 */
export const createPublicApiClient = (options = {}) => {
  return createApiClient({
    ...options,
    useAuth: false, // Don't apply auth interceptors
  });
};
