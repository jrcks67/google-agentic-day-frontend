// hooks/useChat.js
import { useState, useCallback, useEffect } from 'react';
import { useChatApi } from './useChatApi';
import { useWebSocketChat } from './useWebsocketChat';

export const useChat = (initialConfig = null) => {
  const [currentFeed, setCurrentFeed] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('rag_agent'); // Use correct agent key
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // WebSocket connection for real-time chat
  const {
    isConnected,
    messages: wsMessages,
    currentFeedId,
    isLoading: wsLoading,
    error: wsError,
    initializeChat,
    sendMessage: wsSendMessage,
    reconnect,
    clearMessages,
    clearError: clearWsError
  } = useWebSocketChat();

  // REST API for feed management
  const {
    loading: apiLoading,
    error: apiError,
    createFeed,
    getFeedPrompts,
    clearError: clearApiError
  } = useChatApi();

  // Initialize a new chat session
  const startNewChat = useCallback(async (config) => {
    try {
      // Validate required fields
      if (!config.userId) {
        return { success: false, error: 'User ID is required' };
      }
      if (!config.classId) {
        return { success: false, error: 'Class ID is required' };
      }

      // Ensure selected_agents is not empty (required field)
      const defaultAgents = [
        'rag_agent',
        'hyperlocal_generator',
        'quiz_generator',
        'assessment_agent'
      ];
      const selectedAgents = config.selectedAgents && config.selectedAgents.length > 0 
        ? config.selectedAgents 
        : defaultAgents;

      // Safely map context files, filtering out undefined/null values
      const contextFiles = selectedDocuments
        .filter(doc => doc && (doc.name || doc.filename || doc.file_name))
        .map(doc => doc.name || doc.filename || doc.file_name);

      const chatConfig = {
        userId: config.userId,
        classId: config.classId,
        title: config.title || 'New Chat',
        contextData: config.contextData || '',
        contextFiles: contextFiles,
        selectedAgents: selectedAgents
      };

      console.log('Creating feed with config:', chatConfig);

      // First create feed via REST API
      const { data: feedResponse, error: feedError } = await createFeed(chatConfig);
      
      if (feedError) {
        console.error('Feed creation error:', feedError);
        return { success: false, error: feedError };
      }

      const feedId = feedResponse.feed_id;
      console.log('Feed created successfully:', feedId);

      // Inject feedId into URL without redirect
      const currentPath = window.location.pathname;
      let newPath;
      
      if (currentPath.includes('/chat')) {
        // If already on a chat route, replace or add feedId
        newPath = currentPath.endsWith('/chat') 
          ? `${currentPath}/${feedId}` 
          : currentPath.replace(/\/chat\/.*$/, `/chat/${feedId}`);
      } else {
        // If not on chat route, construct new path with dashboard prefix
        newPath = `/dashboard/classes/${config.classId}/chat/${feedId}`;
      }
      
      console.log('Injecting feedId into URL:', newPath);
      window.history.replaceState(null, '', newPath);

      // Wait a bit for WebSocket to be ready if it's not connected yet
      let attempts = 0;
      const maxAttempts = 10;
      while (!isConnected && attempts < maxAttempts) {
        console.log(`Waiting for WebSocket connection... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      // Then initialize WebSocket chat if connected
      if (isConnected) {
        console.log('Initializing WebSocket chat with feedId:', feedId);
        initializeChat({ ...chatConfig, feedId });
        setCurrentFeed({ ...chatConfig, feedId });
        clearMessages();
        return { success: true, feedId };
      } else {
        console.warn('WebSocket not connected after waiting, feed created but chat not initialized');
        return { success: true, feedId, warning: 'Chat created but real-time connection not available' };
      }
    } catch (error) {
      console.error('Error in startNewChat:', error);
      return { success: false, error: error.message || 'Failed to start chat' };
    }
  }, [isConnected, selectedDocuments, createFeed, initializeChat, clearMessages]);

  // Load existing chat by feedId
  const loadExistingChat = useCallback(async (feedId, classId) => {
    try {
      console.log('Loading existing chat:', feedId);

      // Get feed prompts to load chat history
      const { data: promptsData, error: promptsError } = await getFeedPrompts(feedId);
      
      if (promptsError) {
        console.error('Error loading chat history:', promptsError);
        return { success: false, error: promptsError };
      }

      // Wait for WebSocket connection
      let attempts = 0;
      const maxAttempts = 10;
      while (!isConnected && attempts < maxAttempts) {
        console.log(`Waiting for WebSocket connection... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      // Initialize WebSocket chat with existing feedId
      if (isConnected) {
        console.log('Initializing WebSocket chat with existing feedId:', feedId);
        initializeChat({
          userId: promptsData.user_id || 'unknown',
          classId: classId,
          title: promptsData.title || 'Existing Chat',
          contextData: promptsData.context_data || '',
          contextFiles: promptsData.context_files || [],
          selectedAgents: promptsData.selected_agents || ['rag_agent'],
          feedId: feedId
        });
        
        setCurrentFeed({
          userId: promptsData.user_id || 'unknown',
          classId: classId,
          title: promptsData.title || 'Existing Chat',
          feedId: feedId
        });

        return { success: true, feedId };
      } else {
        console.warn('WebSocket not connected, cannot load existing chat');
        return { success: false, error: 'WebSocket connection not available' };
      }
    } catch (error) {
      console.error('Error in loadExistingChat:', error);
      return { success: false, error: error.message || 'Failed to load existing chat' };
    }
  }, [isConnected, getFeedPrompts, initializeChat]);

  // Send a message
  const sendChatMessage = useCallback((message) => {
    if (!currentFeedId) {
      return { success: false, error: 'No active chat session' };
    }

    if (!isConnected) {
      return { success: false, error: 'Not connected to chat server' };
    }

    try {
      wsSendMessage(message, selectedAgent);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send message' };
    }
  }, [currentFeedId, selectedAgent, wsSendMessage, isConnected]);

  // Update context (documents/students)
  const updateContext = useCallback((documents, students) => {
    setSelectedDocuments(documents || []);
    setSelectedStudents(students || []);
  }, []);

  // Combined loading state
  const isLoading = apiLoading || wsLoading;

  // Handle error properly - ensure it's always a string
  const error = (() => {
    const currentError = wsError || apiError;
    if (!currentError) return null;
    
    if (typeof currentError === 'string') return currentError;
    if (currentError.message) return currentError.message;
    if (currentError.detail) return currentError.detail;
    if (Array.isArray(currentError)) return currentError.join(', ');
    
    return 'An error occurred';
  })();

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    clearWsError();
    clearApiError();
  }, [clearWsError, clearApiError]);

  return {
    // Connection state
    isConnected,
    isLoading,
    error,
    
    // Chat state
    currentFeed,
    messages: wsMessages,
    selectedAgent,
    selectedDocuments,
    selectedStudents,
    
    // Actions
    startNewChat,
    loadExistingChat,
    sendMessage: sendChatMessage,
    setSelectedAgent,
    updateContext,
    reconnect,
    clearAllErrors,
    
    // Utils
    hasActiveChat: !!currentFeedId,
    messageCount: wsMessages.length
  };
};
