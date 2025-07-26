// Auth utility functions for backend API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fastapi-gcp-demo-172045447240.us-central1.run.app/';

/**
 * Get authorization header for authenticated requests
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  const tokenType = localStorage.getItem('tokenType') || 'bearer';

  if (!token) {
    return {};
  }

  return {
    'Authorization': `${tokenType} ${token}`
  };
};

/**
 * Make authenticated API request
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  const authHeaders = getAuthHeader();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });
};

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name (optional)
 * @returns {Promise<{data: any, error: any}>}
 */
export const signUpWithEmail = async (email, password, fullName) => {
  try {
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const requestBody = {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    };

    console.log('Signup request:', { ...requestBody, password: '***' });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Signup response:', data);

    if (!response.ok) {
      // Return the exact error message from backend
      return {
        data: null,
        error: {
          message: data.detail || `Signup failed (${response.status})`,
          status: response.status
        }
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{data: any, error: any}>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    // Create form data exactly like the working curl command
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      return { data: null, error: { message: data.detail || 'Login failed' } };
    }

    // Store access token from the response format: { "access_token": "...", "token_type": "bearer" }
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('tokenType', data.token_type || 'bearer');
      console.log('Token stored successfully');
    }

    return { data, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error: { message: 'Network error occurred: ' + error.message } };
  }
};

/**
 * Sign out user
 * @returns {Promise<{error: any}>}
 */
export const signOut = async () => {
  try {
    // Clear tokens from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    console.log('User signed out successfully');

    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: { message: 'Logout failed' } };
  }
};

/**
 * Verify email with OTP/token
 * @param {string} email - User's email
 * @param {string} token - Verification token/OTP
 * @returns {Promise<{data: any, error: any}>}
 */
export const verifyOtp = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.detail || 'Verification failed' } };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Verification error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Resend confirmation email
 * @param {string} email - User's email
 * @returns {Promise<{data: any, error: any}>}
 */
export const resendConfirmationEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/resend-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.detail || 'Failed to resend confirmation' } };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Resend confirmation error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Get current user information
 * @returns {Promise<any>}
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
      }
      return null;
    }

    const data = await response.json();
    console.log('Current user data:', data);
    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    // Simply check if token exists - no API call needed
    return true;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

/**
 * Get current session (for compatibility with existing code)
 * @returns {Promise<any>}
 */
export const getCurrentSession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    return {
      access_token: token,
      user: user,
    };
  } catch (error) {
    console.error('Get current session error:', error);
    return null;
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<any>}
 */
export const updateUserProfile = async (updates) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Profile update failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    return null;
  }
};

/**
 * Reset password
 * @param {string} email - User's email
 * @returns {Promise<any>}
 */
export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Password reset failed');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    return null;
  }
};

/**
 * Update password
 * @param {string} newPassword - New password
 * @param {string} currentPassword - Current password (optional)
 * @returns {Promise<any>}
 */
export const updatePassword = async (newPassword, currentPassword = '') => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        new_password: newPassword,
        current_password: currentPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Password update failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update password error:', error);
    return null;
  }
};

/**
 * Refresh token
 * @returns {Promise<any>}
 */
export const getRefresh = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      localStorage.removeItem('authToken');
      return null;
    }

    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      return {
        access_token: data.access_token,
        user: data.user,
      };
    }

    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    localStorage.removeItem('authToken');
    return null;
  }
};

/**
 * Auth state change listener (simplified for backend auth)
 * @param {Function} callback - Callback function
 * @returns {Object} - Listener object with unsubscribe method
 */
export const onAuthStateChange = (callback) => {
  // For backend auth, we'll use a simple interval to check auth state
  // In a real implementation, you might use WebSocket or Server-Sent Events
  let isActive = true;
  let lastAuthState = null;

  const checkAuthState = async () => {
    if (!isActive) return;

    try {
      const authenticated = await isAuthenticated();
      const user = authenticated ? await getCurrentUser() : null;
      
      const currentState = {
        authenticated,
        user,
      };

      // Only call callback if state changed
      if (JSON.stringify(currentState) !== JSON.stringify(lastAuthState)) {
        lastAuthState = currentState;
        callback(authenticated ? 'SIGNED_IN' : 'SIGNED_OUT', currentState);
      }
    } catch (error) {
      console.error('Auth state check error:', error);
    }

    // Check again in 30 seconds
    if (isActive) {
      setTimeout(checkAuthState, 30000);
    }
  };

  // Start checking
  checkAuthState();

  return {
    data: {
      subscription: {
        unsubscribe: () => {
          isActive = false;
        },
      },
    },
  };
};

/**
 * OAuth sign in (if supported by backend)
 * @param {string} provider - OAuth provider (google, github, etc.)
 * @returns {Promise<{data: any, error: any}>}
 */
export const signInWithOAuth = async (provider) => {
  try {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/oauth/${provider}`;
    return { data: { url: `${API_BASE_URL}/api/auth/oauth/${provider}` }, error: null };
  } catch (error) {
    console.error('OAuth sign in error:', error);
    return { data: null, error: { message: 'OAuth sign in failed' } };
  }
};
