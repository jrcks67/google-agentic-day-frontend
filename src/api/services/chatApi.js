import { chatClient } from "../apiClients";

/**
 * Chat API Service
 * Provides methods for interacting with chat AI endpoints
 */
export const chatApi = {
  /**
   * Send a prompt to the chat service and get an AI response
   * 
   * @param {Object} params - Request parameters
   * @param {String} params.prompt - The user's message or prompt
   * @param {String} [params.conversationId] - Optional conversation ID for context
   * @param {Object} [params.options] - Optional configuration parameters
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with AI reply or error
   */
  sendPrompt: async ({ prompt, conversationId, options = {} }) => {
    try {
      const response = await chatClient.post("/", { 
        prompt, 
        conversation_id: conversationId,
        ...options 
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Chat API error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to communicate with chat service",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Get chat history for a conversation
   * 
   * @param {String} conversationId - The conversation ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with chat history or error
   */
  getChatHistory: async (conversationId) => {
    try {
      const response = await chatClient.get(`/history/${conversationId}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get chat history error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to get chat history",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Get all conversations for the current user
   * 
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with conversations or error
   */
  getConversations: async () => {
    try {
      const response = await chatClient.get("/conversations");
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get conversations error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to get conversations",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Create a new conversation
   * 
   * @param {String} title - The conversation title
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new conversation or error
   */
  createConversation: async (title) => {
    try {
      const response = await chatClient.post("/conversations", { title });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Create conversation error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to create conversation",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Delete a conversation
   * 
   * @param {String} conversationId - The conversation ID to delete
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response or error
   */
  deleteConversation: async (conversationId) => {
    try {
      const response = await chatClient.delete(`/conversations/${conversationId}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Delete conversation error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to delete conversation",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Update conversation title
   * 
   * @param {String} conversationId - The conversation ID
   * @param {String} title - The new title
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response or error
   */
  updateConversation: async (conversationId, title) => {
    try {
      const response = await chatClient.put(`/conversations/${conversationId}`, { title });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Update conversation error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to update conversation",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  }
};
