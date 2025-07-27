// hooks/useChatApi.js
import { useState, useCallback } from 'react';
import { chatApi } from '../api/services/chatApi';

export const useChatApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new feed
  const createFeed = useCallback(async (feedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await chatApi.createFeed(feedData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create feed';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Get all prompts for a feed
  const getFeedPrompts = useCallback(async (feedId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await chatApi.getFeedPrompts(feedId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get prompts';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Create a new prompt (for manual prompt creation if needed)
  const createPrompt = useCallback(async (promptData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await chatApi.createPrompt(promptData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create prompt';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  return {
    loading,
    error,
    createFeed,
    getFeedPrompts,
    createPrompt,
    clearError: () => setError(null)
  };
};