// Auth utility functions for backend API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fastapi-gcp-demo-172045447240.us-central1.run.app/';

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name (optional)
 * @param {string} companyName - Company name (optional)
 * @returns {Promise<{data: any, error: any}>}
 */
export const signUpWithEmail = async (email, password, fullName) => {
  try {
    var firstname = fullName.split(' ')[0];
    var lastname = fullName.split(' ')[1];
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        first_name: firstname,
        last_name: lastname
      }),
    })
    .then(data => console.log(data))
    .catch(error => console.error('Signup error:', error));

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.detail || 'Signup failed' } };
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
    const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(data => console.log(data))
    .catch(error => console.error('SignIn error:', error));

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.detail || 'Login failed' } };
    }

    // Store access token if provided
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error: { message: 'Network error occurred: ' + error } };
  }
};

/**
 * Sign out user
 * @returns {Promise<{error: any}>}
 */
export const signOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      credentials: 'include',
    });

    // Clear local storage regardless of response
    localStorage.removeItem('authToken');

    if (!response.ok) {
      const data = await response.json();
      return { error: { message: data.detail || 'Logout failed' } };
    }

    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear token even if request fails
    localStorage.removeItem('authToken');
    return { error: { message: 'Network error occurred' } };
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

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      return null;
    }

    const data = await response.json();
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

    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      return false;
    }

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
