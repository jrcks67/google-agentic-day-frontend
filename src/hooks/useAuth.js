import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as auth from '../utils/auth'

// 1. Signup Hook
export const useSignUp = () =>
  useMutation({
    mutationFn: async ({ email, password, fullName }) => {
      const { data, error } = await auth.signUpWithEmail(email, password, fullName);
      return { data, error };
    },
    onSuccess: (response) => {
      console.log('Signup response:', response);
    },
    onError: (error) => {
      console.error('Signup mutation error:', error);
    }
  })

// 2. Resend Confirmation Email
export const useResendConfirmation = () =>
  useMutation({
    mutationFn: ({ email }) => auth.resendConfirmationEmail(email),
  })

// 3. Verify OTP
export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ email, token }) => auth.verifyOtp(email, token),
  })

// 4. Sign In
export const useSignIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await auth.signInWithEmail(email, password);
      return { data, error };
    },
    onSuccess: (response) => {
      console.log(response);
      if (response.error) {
        throw new Error(response.error.message);
      }
      else {
        console.log("token: " + response.data.access_token)
        // Invalidate queries to refresh authentication state
        queryClient.invalidateQueries({ queryKey: ['current-user'] })
        queryClient.invalidateQueries({ queryKey: ['is-authenticated'] })
        queryClient.invalidateQueries({ queryKey: ['current-session'] })
        window.location.href = '/dashboard'
      }
    }
  })
}

// 5. Sign Out
export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      console.log('useSignOut: Starting logout process...');
      const { error } = await auth.signOut();
      if (error) {
        console.error('useSignOut: Logout error:', error);
        throw new Error(error.message);
      }
      console.log('useSignOut: Logout successful');
      return { error };
    },
    onSuccess: () => {
      console.log('useSignOut: Cleaning up React Query cache...');
      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      queryClient.invalidateQueries({ queryKey: ['is-authenticated'] })
      queryClient.invalidateQueries({ queryKey: ['current-session'] })

      // Clear all cached data
      queryClient.clear()

      console.log('useSignOut: Redirecting to signin page...');
      window.location.href = '/signin'
    },
    onError: (error) => {
      console.error('useSignOut: Mutation error:', error);
      // Even if logout fails, clear cache and redirect
      queryClient.clear()
      window.location.href = '/signin'
    }
  })
}

// 6. OAuth Login
export const useSignInWithOAuth = () =>
  useMutation({
    mutationFn: ({ provider }) => auth.signInWithOAuth(provider),
  })

// 7. Get Current User (cached, refetchable)
export const useCurrentUser = () =>
  useQuery({
    queryKey: ['current-user'],
    queryFn: auth.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// 8. Is Authenticated (boolean)
export const useIsAuthenticated = () =>
  useQuery({
    queryKey: ['is-authenticated'],
    queryFn: async () => {
      const result = await auth.isAuthenticated();
      console.log('useIsAuthenticated query result:', result);
      return result;
    },
    staleTime: 1000 * 60 * 2,
    retry: false, // Don't retry auth checks
  })

// 9. Get Current Session
export const useCurrentSession = () =>
  useQuery({
    queryKey: ['current-session'],
    queryFn: auth.getCurrentSession,
    staleTime: 1000 * 60 * 5,
  })

// 10. Update Profile
export const useUpdateUserProfile = () =>
  useMutation({
    mutationFn: (updates) => auth.updateUserProfile(updates),
  })

// 11. Password Reset
export const useResetPassword = () =>
  useMutation({
    mutationFn: (email) => auth.resetPassword(email),
  })

// 12. Update Password
export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (newPassword) => auth.updatePassword(newPassword),
  })

// 13. Auth state change listener
export const useAuthStateListener = (callback) => {
  React.useEffect(() => {
    const { data: listener } = auth.onAuthStateChange(callback)
    return () => listener.subscription.unsubscribe()
  }, [callback])
}
