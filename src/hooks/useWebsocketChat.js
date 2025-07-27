// hooks/useWebSocketChat.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocketChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentFeedId, setCurrentFeedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // WebSocket connection
  const connect = useCallback(() => {
    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/chat`;
      console.log('🔗 Connecting to WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received message:', data);

          switch (data.type) {
            case 'chat_initialized':
              setCurrentFeedId(data.feed_id);
              setError(null);
              break;

            case 'prompt_created':
              // Message acknowledged, show loading state
              setIsLoading(true);
              break;

            case 'chat_response':
              // AI response received
              const aiMessage = {
                id: data.prompt_id,
                type: 'ai',
                content: data.ai_response,
                agent: data.agent_used,
                sources: data.context_files || [],
                timestamp: new Date(data.timestamp),
                contextUsed: data.context_files?.length || 0
              };
              
              setMessages(prev => [...prev, aiMessage]);
              setIsLoading(false);
              break;

            case 'error':
              setError(data.message);
              setIsLoading(false);
              break;

            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          console.log(`⏰ Scheduling reconnect in ${timeout}ms (attempt ${reconnectAttempts.current + 1})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            console.log(`🔄 Reconnecting... Attempt ${reconnectAttempts.current}`);
            connect();
          }, timeout);
        } else if (event.code !== 1000) {
          console.log('❌ Max reconnection attempts reached');
          setError('Connection lost. Please refresh the page to reconnect.');
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setError('Connection error. Please check your internet connection.');
      };

    } catch (err) {
      console.error('❌ Error creating WebSocket connection:', err);
      setError('Failed to establish connection');
    }
  }, []);

  // Initialize chat session
  const initializeChat = useCallback((chatConfig) => {
    if (!isConnected || !ws.current) {
      setError('Not connected to server');
      return;
    }

    // Validate required fields
    if (!chatConfig.userId) {
      setError('User ID is required for chat initialization');
      return;
    }
    if (!chatConfig.classId) {
      setError('Class ID is required for chat initialization');
      return;
    }
    if (!chatConfig.selectedAgents || chatConfig.selectedAgents.length === 0) {
      setError('At least one agent must be selected');
      return;
    }

    const message = {
      type: 'init_chat',
      user_id: chatConfig.userId,
      class_id: chatConfig.classId,
      title: chatConfig.title || 'New Chat',
      context_data: chatConfig.contextData || '',
      context_files: chatConfig.contextFiles || [],
      selected_agents: chatConfig.selectedAgents,
      feed_id: chatConfig.feedId || null
    };

    console.log('Sending WebSocket init_chat message:', message);
    ws.current.send(JSON.stringify(message));
  }, [isConnected]);

  // Send chat message
  const sendMessage = useCallback((userPrompt, selectedAgent) => {
    if (!isConnected || !ws.current || !currentFeedId) {
      setError('Chat not initialized or not connected');
      return;
    }

    // Validate required fields
    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      setError('User prompt is required and cannot be empty');
      return;
    }
    if (!selectedAgent || typeof selectedAgent !== 'string') {
      setError('Selected agent is required');
      return;
    }

    // Add user message to local state immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userPrompt.trim(),
      agent: selectedAgent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Send to WebSocket with validated data
    const message = {
      type: 'chat_message',
      feed_id: currentFeedId,
      user_prompt: userPrompt.trim(),
      selected_agent: selectedAgent
    };

    console.log('Sending WebSocket chat_message:', message);
    ws.current.send(JSON.stringify(message));
    setError(null);
  }, [isConnected, currentFeedId]);

  // Connect on mount and cleanup on unmount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, []); // Remove connect dependency to prevent reconnections

  return {
    isConnected,
    messages,
    currentFeedId,
    isLoading,
    error,
    initializeChat,
    sendMessage,
    reconnect: connect,
    clearMessages: () => setMessages([]),
    clearError: () => setError(null)
  };
};
