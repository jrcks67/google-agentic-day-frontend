import axios from "axios";
import { getCurrentSession, getRefresh, signOut } from "../../utils/auth";

// Queue for handling concurrent requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Auth interceptor for Axios requests
 * Uses localStorage token or getCurrentSession for the latest access token
 */
export const authRequestInterceptor = async (config) => {
  try {
    // First try to get token from localStorage (faster)
    let token = localStorage.getItem('authToken');
    
    // If no token in localStorage, try to get from session
    if (!token) {
      const session = await getCurrentSession();
      token = session?.access_token;
      
      // Store token in localStorage if found
      if (token) {
        localStorage.setItem('authToken', token);
      }
    }
    
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    return config;
  } catch (error) {
    console.error("Auth interceptor error:", error);
    return config;
  }
};

/**
 * Auth response interceptor for Axios responses
 */
export const authResponseInterceptor = (response) => response;

/**
 * Auth error interceptor for Axios errors
 * Handles 401s, tries to refresh session, retries once, signs out if refresh fails
 */
export const authErrorInterceptor = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        // Attempt to refresh session using getRefresh
        const session = await getRefresh();
        if (!session || !session.access_token) {
          throw new Error("Failed to refresh session");
        }
        
        const newToken = session.access_token;
        localStorage.setItem('authToken', newToken);
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('authToken');
        try {
          const { error: signOutError } = await signOut();
          if (signOutError) {
            console.error("Error during sign out:", signOutError);
          }
        } catch (signOutCatch) {
          console.error("Unexpected error during sign out:", signOutCatch);
        }
        // Redirect to signin page
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Queue requests while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      }).catch(err => Promise.reject(err));
    }
  } else if (error.response && error.response.status === 401) {
    // If already retried and still 401, sign out
    localStorage.removeItem('authToken');
    try {
      const { error: signOutError } = await signOut();
      if (signOutError) {
        console.error("Error during sign out:", signOutError);
      }
    } catch (signOutCatch) {
      console.error("Unexpected error during sign out:", signOutCatch);
    }
    window.location.href = "/signin";
    return Promise.reject(new Error("Session expired. Please sign in again."));
  }

  return Promise.reject(error);
};

/**
 * Helper to initialize token on app load
 */
export const initializeAuthToken = async () => {
  try {
    const session = await getCurrentSession();
    if (session?.access_token) {
      localStorage.setItem('authToken', session.access_token);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    localStorage.removeItem('authToken');
    console.error("Failed to initialize auth token:", error);
  }
};

/**
 * Setup function to register interceptors on an Axios instance
 */
export const setupAuthInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(authRequestInterceptor);
  axiosInstance.interceptors.response.use(
    authResponseInterceptor,
    authErrorInterceptor
  );
};
